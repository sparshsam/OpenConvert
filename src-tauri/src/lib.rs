use chrono::{DateTime, Utc};
use image::{DynamicImage, ImageFormat, ImageReader};
use serde::{Deserialize, Serialize};
use std::{
    fs::{self, File},
    io::BufWriter,
    path::{Path, PathBuf},
};
use tauri::{
    menu::{Menu, MenuItem, Submenu},
    AppHandle, Emitter, Manager,
};

const HISTORY_FILE: &str = "history.json";

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
pub struct ImageInfo {
    pub path: String,
    pub filename: String,
    pub format: String,
    pub width: u32,
    pub height: u32,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
pub struct ConversionHistoryItem {
    pub original_filename: String,
    pub input_format: String,
    pub output_format: String,
    pub timestamp: DateTime<Utc>,
    pub result_status: String,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
pub struct ConversionResult {
    pub output_path: String,
    pub history: ConversionHistoryItem,
}

#[tauri::command]
fn get_image_info(path: String) -> Result<ImageInfo, String> {
    let input = PathBuf::from(path);
    let format = detect_format(&input)?;
    let reader = ImageReader::open(&input)
        .map_err(|error| format!("Could not open image: {error}"))?
        .with_guessed_format()
        .map_err(|error| format!("Could not detect image format: {error}"))?;
    let dimensions = reader
        .into_dimensions()
        .map_err(|error| format!("Could not read image dimensions: {error}"))?;

    Ok(ImageInfo {
        path: input.to_string_lossy().to_string(),
        filename: filename_only(&input),
        format,
        width: dimensions.0,
        height: dimensions.1,
    })
}

#[tauri::command]
fn convert_image(
    app: AppHandle,
    input_path: String,
    output_dir: String,
    output_format: String,
) -> Result<ConversionResult, String> {
    let input = PathBuf::from(input_path);
    let output_directory = PathBuf::from(output_dir);
    let input_format = detect_format(&input)?;
    let normalized_output = normalize_format(&output_format)?;
    let original_filename = filename_only(&input);

    let result = convert_image_inner(&input, &output_directory, &normalized_output);
    let status = if result.is_ok() { "success" } else { "failure" }.to_string();
    let history_item = ConversionHistoryItem {
        original_filename,
        input_format,
        output_format: normalized_output.clone(),
        timestamp: Utc::now(),
        result_status: status,
    };
    append_history(&app, history_item.clone())?;

    match result {
        Ok(output_path) => Ok(ConversionResult {
            output_path: output_path.to_string_lossy().to_string(),
            history: history_item,
        }),
        Err(error) => Err(error),
    }
}

#[tauri::command]
fn list_history(app: AppHandle) -> Result<Vec<ConversionHistoryItem>, String> {
    read_history(&app)
}

#[tauri::command]
fn clear_history(app: AppHandle) -> Result<(), String> {
    write_history(&app, &[])
}

pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_updater::Builder::new().build())
        .invoke_handler(tauri::generate_handler![
            get_image_info,
            convert_image,
            list_history,
            clear_history
        ])
        .setup(|app| {
            install_menu(app.handle())?;
            Ok(())
        })
        .on_menu_event(|app, event| {
            let id = event.id().0.as_str();
            if id == "exit" {
                app.exit(0);
                return;
            }
            let _ = app.emit("menu-event", id);
        })
        .run(tauri::generate_context!())
        .expect("error while running OpenConvert");
}

fn install_menu(app: &AppHandle) -> tauri::Result<()> {
    let open_file = MenuItem::with_id(app, "open-file", "Open File", true, Some("Ctrl+O"))?;
    let output_folder = MenuItem::with_id(
        app,
        "select-output-folder",
        "Select Output Folder",
        true,
        Some("Ctrl+Shift+O"),
    )?;
    let convert = MenuItem::with_id(app, "convert", "Convert", true, Some("Ctrl+Enter"))?;
    let exit = MenuItem::with_id(app, "exit", "Exit", true, Some("Alt+F4"))?;
    let file = Submenu::with_items(app, "File", true, &[&open_file, &output_folder, &convert, &exit])?;

    let clear_history = MenuItem::with_id(app, "clear-history", "Clear History", true, None::<&str>)?;
    let settings = MenuItem::with_id(app, "settings", "Settings", true, None::<&str>)?;
    let edit = Submenu::with_items(app, "Edit", true, &[&clear_history, &settings])?;

    let reset_layout = MenuItem::with_id(app, "reset-layout", "Reset Layout", true, None::<&str>)?;
    let view = Submenu::with_items(app, "View", true, &[&reset_layout])?;

    let about = MenuItem::with_id(app, "about", "About OpenConvert", true, None::<&str>)?;
    let github = MenuItem::with_id(app, "github", "GitHub", true, None::<&str>)?;
    let release_notes = MenuItem::with_id(app, "release-notes", "Release Notes", true, None::<&str>)?;
    let check_updates = MenuItem::with_id(app, "check-updates", "Check for Updates", true, None::<&str>)?;
    let report_issue = MenuItem::with_id(app, "report-issue", "Report Issue", true, None::<&str>)?;
    let help = Submenu::with_items(
        app,
        "Help",
        true,
        &[&about, &github, &release_notes, &check_updates, &report_issue],
    )?;

    let menu = Menu::with_items(app, &[&file, &edit, &view, &help])?;
    app.set_menu(menu)?;
    Ok(())
}

fn convert_image_inner(input: &Path, output_dir: &Path, output_format: &str) -> Result<PathBuf, String> {
    if !output_dir.is_dir() {
        return Err("Output folder does not exist.".to_string());
    }

    let image = ImageReader::open(input)
        .map_err(|error| format!("Could not open image: {error}"))?
        .with_guessed_format()
        .map_err(|error| format!("Could not detect image format: {error}"))?
        .decode()
        .map_err(|error| format!("Could not decode image: {error}"))?;

    let output_path = safe_output_path(input, output_dir, output_format)?;
    write_image(&image, &output_path, output_format)?;
    Ok(output_path)
}

fn write_image(image: &DynamicImage, output_path: &Path, output_format: &str) -> Result<(), String> {
    let file = File::create(output_path).map_err(|error| format!("Could not create output file: {error}"))?;
    let mut writer = BufWriter::new(file);

    match output_format {
        "jpg" | "jpeg" => {
            let rgb = image.to_rgb8();
            let mut encoder = image::codecs::jpeg::JpegEncoder::new_with_quality(&mut writer, 92);
            encoder
                .encode_image(&DynamicImage::ImageRgb8(rgb))
                .map_err(|error| format!("Could not write JPG: {error}"))
        }
        "png" => image
            .write_to(&mut writer, ImageFormat::Png)
            .map_err(|error| format!("Could not write PNG: {error}")),
        "webp" => image
            .write_to(&mut writer, ImageFormat::WebP)
            .map_err(|error| format!("Could not write WEBP: {error}")),
        "bmp" => image
            .write_to(&mut writer, ImageFormat::Bmp)
            .map_err(|error| format!("Could not write BMP: {error}")),
        "tiff" => image
            .write_to(&mut writer, ImageFormat::Tiff)
            .map_err(|error| format!("Could not write TIFF: {error}")),
        _ => Err("Unsupported output format.".to_string()),
    }
}

fn safe_output_path(input: &Path, output_dir: &Path, output_format: &str) -> Result<PathBuf, String> {
    let stem = input.file_stem().and_then(|value| value.to_str()).unwrap_or("image");
    let extension = extension_for(output_format)?;
    let mut candidate = output_dir.join(format!("{stem}-converted.{extension}"));
    let mut index = 2;

    while candidate.exists() {
        candidate = output_dir.join(format!("{stem}-converted-{index}.{extension}"));
        index += 1;
    }

    Ok(candidate)
}

fn detect_format(path: &Path) -> Result<String, String> {
    if let Ok(Some(kind)) = infer::get_from_path(path) {
        return normalize_mime(kind.mime_type());
    }

    let extension = path
        .extension()
        .and_then(|value| value.to_str())
        .unwrap_or_default()
        .to_lowercase();
    normalize_format(&extension)
}

fn normalize_mime(mime: &str) -> Result<String, String> {
    match mime {
        "image/png" => Ok("png".to_string()),
        "image/jpeg" => Ok("jpg".to_string()),
        "image/webp" => Ok("webp".to_string()),
        "image/bmp" => Ok("bmp".to_string()),
        "image/tiff" => Ok("tiff".to_string()),
        _ => Err("Unsupported image format. Use PNG, JPG/JPEG, WEBP, BMP, or TIFF.".to_string()),
    }
}

fn normalize_format(format: &str) -> Result<String, String> {
    match format.trim().to_lowercase().as_str() {
        "png" => Ok("png".to_string()),
        "jpg" | "jpeg" => Ok("jpg".to_string()),
        "webp" => Ok("webp".to_string()),
        "bmp" => Ok("bmp".to_string()),
        "tif" | "tiff" => Ok("tiff".to_string()),
        _ => Err("Unsupported image format. Use PNG, JPG/JPEG, WEBP, BMP, or TIFF.".to_string()),
    }
}

fn extension_for(format: &str) -> Result<&'static str, String> {
    match format {
        "png" => Ok("png"),
        "jpg" | "jpeg" => Ok("jpg"),
        "webp" => Ok("webp"),
        "bmp" => Ok("bmp"),
        "tiff" => Ok("tiff"),
        _ => Err("Unsupported output format.".to_string()),
    }
}

fn filename_only(path: &Path) -> String {
    path.file_name()
        .and_then(|value| value.to_str())
        .unwrap_or("unknown")
        .to_string()
}

fn history_path(app: &AppHandle) -> Result<PathBuf, String> {
    let app_data = app
        .path()
        .app_data_dir()
        .map_err(|error| format!("Could not resolve app data directory: {error}"))?;
    fs::create_dir_all(&app_data).map_err(|error| format!("Could not create app data directory: {error}"))?;
    Ok(app_data.join(HISTORY_FILE))
}

fn read_history(app: &AppHandle) -> Result<Vec<ConversionHistoryItem>, String> {
    let path = history_path(app)?;
    if !path.exists() {
        return Ok(Vec::new());
    }

    let content = fs::read_to_string(path).map_err(|error| format!("Could not read history: {error}"))?;
    serde_json::from_str(&content).map_err(|error| format!("Could not parse history: {error}"))
}

fn write_history(app: &AppHandle, history: &[ConversionHistoryItem]) -> Result<(), String> {
    let path = history_path(app)?;
    let content = serde_json::to_string_pretty(history).map_err(|error| format!("Could not encode history: {error}"))?;
    fs::write(path, content).map_err(|error| format!("Could not write history: {error}"))
}

fn append_history(app: &AppHandle, item: ConversionHistoryItem) -> Result<(), String> {
    let mut history = read_history(app)?;
    history.insert(0, item);
    history.truncate(100);
    write_history(app, &history)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn normalizes_supported_formats() {
        assert_eq!(normalize_format("JPEG").unwrap(), "jpg");
        assert_eq!(normalize_format("tif").unwrap(), "tiff");
        assert!(normalize_format("gif").is_err());
    }

    #[test]
    fn safe_output_path_does_not_overwrite() {
        let dir = tempfile::tempdir().unwrap();
        let input = dir.path().join("image.png");
        fs::write(&input, b"source").unwrap();
        fs::write(dir.path().join("image-converted.png"), b"existing").unwrap();

        let output = safe_output_path(&input, dir.path(), "png").unwrap();
        assert_eq!(output.file_name().unwrap(), "image-converted-2.png");
    }

    #[test]
    fn history_item_contains_no_file_paths_or_contents() {
        let item = ConversionHistoryItem {
            original_filename: "photo.png".to_string(),
            input_format: "png".to_string(),
            output_format: "webp".to_string(),
            timestamp: Utc::now(),
            result_status: "success".to_string(),
        };
        let serialized = serde_json::to_string(&item).unwrap();
        assert!(serialized.contains("photo.png"));
        assert!(!serialized.contains("/home/"));
        assert!(!serialized.contains("converted"));
    }
}

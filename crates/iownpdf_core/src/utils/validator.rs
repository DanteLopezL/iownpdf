use std::path::Path;

use crate::errors::IownPdfError;

/// Validates input file for conversion.
///
/// Checks that the file exists and has the expected extension.
pub fn validate_input(file: &Path, extension: &str) -> Result<(), IownPdfError> {
    if !file.exists() {
        return Err(IownPdfError::FileNotFound(file.to_path_buf()));
    }

    if !file.extension().is_some_and(|e| e == extension) {
        return Err(IownPdfError::ConversionFailed(format!(
            "expected .{extension} file, got {:?}",
            file
        )));
    }

    Ok(())
}

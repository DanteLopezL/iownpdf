use std::path::PathBuf;

use thiserror::Error;

/// Errors that can occur during file conversion operations.
#[derive(Debug, Error)]
pub enum IownPdfError {
    /// The specified file was not found.
    #[error("file not found: {0}")]
    FileNotFound(PathBuf),

    /// The file has an unsupported format.
    #[error("unsupported format: expected .{expected}, got .{got}")]
    UnsupportedFormat { expected: String, got: String },

    /// The file is missing an extension.
    #[error("missing extension: {0}")]
    MissingExtension(PathBuf),

    /// The conversion process failed.
    #[error("conversion failed: {0}")]
    ConversionFailed(String),

    /// The requested output directory is missing or not a directory.
    #[error("output directory is not a directory: {0}")]
    InvalidOutputDir(PathBuf),

    /// An I/O error occurred.
    #[error("I/O error: {0}")]
    Io(#[from] std::io::Error),
}

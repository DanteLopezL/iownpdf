use std::path::{Path, PathBuf};

use crate::errors::IownPdfError;

/// Trait for file converters that convert files to PDF.
pub trait FileConverter {
    /// Creates a new converter from the given file path.
    ///
    /// Validates that the file exists and has the correct extension.
    fn new(file: &Path) -> Result<Self, IownPdfError>
    where
        Self: Sized;

    /// Converts the file to PDF and returns the output path.
    fn to_pdf(self) -> Result<PathBuf, IownPdfError>;
}

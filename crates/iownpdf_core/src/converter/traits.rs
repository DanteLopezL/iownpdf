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
    ///
    /// When `output_dir` is `None`, the PDF is written alongside the input
    /// with its extension swapped to `.pdf`. When `Some(dir)`, the PDF is
    /// written inside `dir` using the input's file stem; `dir` must exist.
    fn to_pdf(self, output_dir: Option<&Path>) -> Result<PathBuf, IownPdfError>;
}

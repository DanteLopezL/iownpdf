use std::path::{Path, PathBuf};

use crate::{errors::IownPdfError, utils::validator::validate_input};

pub struct MdConverter {
    file: PathBuf,
}

impl MdConverter {
    pub fn new(file: &Path) -> Result<Self, IownPdfError> {
        validate_input(file, "md")?;
        Ok(Self {
            file: file.to_path_buf(),
        })
    }

    pub fn to_pdf(self) -> Result<Vec<u8>, IownPdfError> {
        todo!()
    }
}

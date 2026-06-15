import re

def validate_pan(pan: str) -> bool:
    pattern = r'^[A-Z]{5}[0-9]{4}[A-Z]$'
    return bool(re.match(pattern, pan))

def validate_aadhaar(aadhaar: str) -> bool:
    pattern = r'^\d{12}$'
    return bool(re.match(pattern, aadhaar))

def calculate_risk(pan_valid: bool, aadhaar_valid: bool) -> str:
    if pan_valid and aadhaar_valid:
        return "LOW"
    elif pan_valid or aadhaar_valid:
        return "MEDIUM"
    else:
        return "HIGH"
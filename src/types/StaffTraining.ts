{
  "name": "StaffTraining",
  "type": "object",
  "properties": {
    "staff_email": {
      "type": "string",
      "description": "Email of staff member"
    },
    "staff_name": {
      "type": "string",
      "description": "Name of staff member"
    },
    "training_type": {
      "type": "string",
      "enum": [
        "hipaa",
        "cybersecurity",
        "data_handling",
        "emergency_procedures",
        "equipment_safety",
        "general_compliance"
      ],
      "description": "Type of training completed"
    },
    "training_title": {
      "type": "string",
      "description": "Title of the training course"
    },
    "completion_date": {
      "type": "string",
      "format": "date"
    },
    "expiration_date": {
      "type": "string",
      "format": "date"
    },
    "certificate_url": {
      "type": "string",
      "description": "URL to training certificate"
    },
    "score": {
      "type": "number",
      "description": "Training score if applicable"
    },
    "status": {
      "type": "string",
      "enum": [
        "completed",
        "expired",
        "pending"
      ],
      "default": "completed"
    },
    "notes": {
      "type": "string"
    }
  },
  "required": [
    "staff_email",
    "staff_name",
    "training_type",
    "training_title"
  ]
}
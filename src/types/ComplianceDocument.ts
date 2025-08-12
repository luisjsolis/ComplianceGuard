{
  "name": "ComplianceDocument",
  "type": "object",
  "properties": {
    "name": {
      "type": "string",
      "description": "Document name"
    },
    "document_type": {
      "type": "string",
      "enum": [
        "policy",
        "procedure",
        "certificate",
        "audit_report",
        "training_record",
        "risk_assessment",
        "other"
      ],
      "description": "Type of compliance document"
    },
    "regulation_type": {
      "type": "string",
      "enum": [
        "hipaa",
        "state_board",
        "osha",
        "ada",
        "hitech",
        "gdpr",
        "other"
      ]
    },
    "file_url": {
      "type": "string",
      "description": "URL to the uploaded document"
    },
    "requirement_id": {
      "type": "string",
      "description": "Related compliance requirement ID"
    },
    "expiration_date": {
      "type": "string",
      "format": "date",
      "description": "When this document expires"
    },
    "status": {
      "type": "string",
      "enum": [
        "current",
        "expired",
        "pending_renewal"
      ],
      "default": "current"
    },
    "description": {
      "type": "string"
    },
    "tags": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "Tags for categorization"
    }
  },
  "required": [
    "name",
    "document_type"
  ]
}
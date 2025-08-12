{
  "name": "ComplianceTask",
  "type": "object",
  "properties": {
    "title": {
      "type": "string",
      "description": "Task title"
    },
    "description": {
      "type": "string",
      "description": "Detailed description of the task"
    },
    "requirement_id": {
      "type": "string",
      "description": "ID of the related compliance requirement"
    },
    "assigned_to": {
      "type": "string",
      "description": "Email of assigned staff member"
    },
    "priority": {
      "type": "string",
      "enum": [
        "critical",
        "high",
        "medium",
        "low"
      ],
      "default": "medium"
    },
    "status": {
      "type": "string",
      "enum": [
        "pending",
        "in_progress",
        "completed",
        "overdue"
      ],
      "default": "pending"
    },
    "due_date": {
      "type": "string",
      "format": "date"
    },
    "completed_date": {
      "type": "string",
      "format": "date"
    },
    "estimated_hours": {
      "type": "number",
      "description": "Estimated hours to complete"
    },
    "notes": {
      "type": "string"
    }
  },
  "required": [
    "title",
    "assigned_to"
  ]
}
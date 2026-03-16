# UML Class Diagram

Last updated: March 15, 2026

## Current UML Diagram

![Current UML](images/current-uml.png)

The final implementation focuses on two primary classes:

- User
- Entry

### User

Attributes
- username : String
- password : String

Operations
- registerUser()
- loginUser()

### Entry

Attributes
- title : String
- body : String
- date : Date
- dateKey : String
- owner : String

Operations
- createEntry()
- deleteEntry()
- updateEntry()
- getEntriesByOwner()
- getEntryById()
- getEntryByDate()

Relationship

A User owns multiple Entries.

---

## Original UML Diagram

![Original UML](images/original-uml.png)

The original design included additional classes:

- Event
- ToDoList
- Task
- ActivityTracker

These features were removed to focus on the core journaling functionality.

---

## Diagram Source Files

The original UML diagrams were created in FigJam.

The editable export of the diagram is stored here:

docs/diagrams/uml-diagram-source.html
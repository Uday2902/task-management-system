# Task Management System API
API documentation for the Task Management System

## Version: 1.0.0

### /tasks

#### GET
##### Summary: Get all tasks

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | A list of tasks |

##### Security

| Security Schema | Scopes |
| --- | --- |
| bearerAuth | |

#### POST
##### Summary: Create a new task

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Created task |
| 201 | Task created successfully |
| 500 | Internal server error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| bearerAuth | |

### /tasks/{id}

#### GET
##### Summary: Get a task by ID

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| id | path | The task ID | Yes | string |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Requested task |
| 404 | Task not found |

##### Security

| Security Schema | Scopes |
| --- | --- |
| bearerAuth | |

#### PUT
##### Summary: Update a task by ID

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| id | path | The task ID | Yes | string |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Updated task |
| 404 | Task not found |
| 500 | Internal server error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| bearerAuth | |

#### DELETE
##### Summary: Delete a task by ID

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| id | path | The task ID | Yes | string |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Message deletion |
| 404 | Task not found |
| 500 | Internal server error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| bearerAuth | |

### /users/login

#### POST
##### Summary: Log in a user

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Login successful |
| 404 | User not found |
| 500 | Internal Server Error |

### /users/register

#### POST
##### Summary: Register a new user

##### Responses

| Code | Description |
| ---- | ----------- |
| 201 | User registered successfully |
| 400 | Bad request |
| 500 | Internal Server Error |

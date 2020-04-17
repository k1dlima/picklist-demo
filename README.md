# PicklistDemo

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 8.3.23.

**PicklistComponent** is a multi-select picklist which also displays multiple columns and enables the user to sort them, it supports some basic selection functionality.

## UI

![Picklist](./screenshot.png?raw=true)

## Dependencies

Used [Angular Material](https://material.angular.io/components/icon/overview) for Icons.

## Parameters

#### @Optional: headers

Default is null. It must be an array of 2 strings.
Displays titles for left and right tables. If null, it will not show.
```javascript
    [ 'Available', 'Selected' ]
```

#### @Required: columnNames

Must be an array of objects with keys - *key* and *value*.
Order of columns will follow the order of the Array.
```json
    [
        { "key": "name", "value": "Name" },
        { "key": "comp", "value": "Company" }
    ]
```

####  @Required: data

Must be an array of objects with the following keys:
* *uid* - a unique identifier.
* rest of the keys - *key* mentioned in each of `columnNames` object.

```json
    [
        {
            "uid": "x",
            "name": "a",
            "comp": "a LLC"
        },
        {
            "uid": "y",
            "name": "b",
            "comp": "b LLC"
        },
        {
            "uid": "z",
            "name": "c",
            "comp": "c LLC"
        }
    ]
```

## Return value

Returns the selected objects which is the subset of `data` in the specified order.

# Database Documentation
- Collections: 
  - eventList
    - Contains the documents for list of events each user is keeping track of. This would be the list of events that show on a user's daily habits page.
  - events
    - Contains the documents for each event occurences recorded for a user. Basically, a specific day's event data for a specific event for the user.
  - images
    - Contains the documents for images that have been added by users.
  - user
    - Contains the data for users.

- Notes:
  - All date inserts should be done automatically via resources [here](https://docs.mongodb.com/manual/reference/method/Date/)
## Collection Specification
```
eventList document{
    _id: <ObjectId1>,       // id of this eventList
    userID: <ObjectId1>,    // id of user that this eventList belongs to
    name: String,           // Name of event / habit that is being kept track of.
}

events document{
    _id: <ObjectId1>,       // id of this event
    userID: <ObjectId1>,    // id of user that this event belongs to
    date: String,           // Date that this specific events this is for. Format: YYYY-mm-dd
    completed: Boolean      // If this event / habit was completed or not.
}

images document{
    _id: <ObjectId1>,       // id of this image. Should also be used as the image's name with ObjectId.toString(). Could probably format it like `${ObjectId.toString()}.jpg`
    userID: <ObjectId1>,    // id of the user that this image belongs to
    date: String,           // Date that this specific image is for. Format: YYYY-mm-dd
    name: String,           // User-specified name for this image.
    caption: String         // Additional details specified by the user for this image.
}

user document{
    _id: <ObjectId1>,       // id of the user.
    username: String,       // user's username used to login. Should be unique.
    password: String,       // user's password used to login.
    theme: int32            // user's theme setting.
}
```

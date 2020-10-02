# Tea Time Topic

### Student report

-  Structure

1-The app use localeStorage for all the display. In case the locale storage is empty, the data is fetched again from the api(functions used: initializeLocalStorage, fetchData, updateLocalStorage, displayTopic)

2-The user can add a new topic to the list(function: handleSubmitTopic)

3- The user can downvote, upvote, set the topic to archive, and delete a topic(function: downVote, upVote, archiveTopic, deleteTopic)

4- When displaying, the topics are filtered into two, next and past topics

5- All of the clicks in the list are handled by the one handler(function: handleClicks)

- Any project improvements possible?

Refactoring might be an improvement

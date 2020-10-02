//handle clicks in the list
export const handleClick = (e) => {
    const topicToUpdate = e.target.closest('article').dataset.id;
    const button = e.target.closest('button');
    if(button.matches('.thumb-up')) {
        console.log(button)
        upVote(topicToUpdate);
    }

    if(button.matches('.thumb-down')) {
        downVote(topicToUpdate);
    }

    if(button.matches('.archive')) {
        console.log('archive');
        archiveTopic(topicToUpdate);
    }

    if(button.matches('.delete')) {
        console.log('delete');
        deleteTopic(topicToUpdate)
    }
}
//set items to local storage
export function updateLocalStorage() {
    localStorage.setItem('topics', JSON.stringify(topics));
}

//init from ls
export function initializeFromLocalStorage() {
    const stringFromLs = localStorage.getItem('topics');
    const lsItems = JSON.parse(stringFromLs);
    if(lsItems) {
        topics = lsItems
        console.log(topics)
    } else {
        fetchData()
    }
    list.dispatchEvent(new CustomEvent('listUpdated')); 
}
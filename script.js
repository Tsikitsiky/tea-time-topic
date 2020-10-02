const addForm = document.querySelector('form');
const nextTopic = document.querySelector('.next-topic');
const pastTopic = document.querySelector('.past-topic');
const list = document.querySelector('.list');
const endPoint = 'https://gist.githubusercontent.com/Pinois/93afbc4a061352a0c70331ca4a16bb99/raw/6da767327041de13693181c2cb09459b0a3657a1/topics.json';

//where we store the topics
let topics = [];

//fetch the data
async function fetchData() {
    const response = await fetch(endPoint);
    const data = await response.json();
    localStorage.setItem('topics', JSON.stringify(data));
    return data;
}

//set items to local storage
function updateLocalStorage() {
    localStorage.setItem('topics', JSON.stringify(topics));
}

//init from ls
function initializeFromLocalStorage() {
    const stringFromLs = localStorage.getItem('topics');
    const lsItems = JSON.parse(stringFromLs);
    if(lsItems) {
        topics = lsItems
    } else {
        fetchData();
    }
    list.dispatchEvent(new CustomEvent('listUpdated')); 
}


//add a topic to the list
const handleSubmitTopic = (e) => {
    e.preventDefault();
    const topic = e.currentTarget.topic.value;
    if(!topic) return;
    const newTopic = {
        id: Date.now().toString(),
		upvotes: 0,
		title: topic,
		downvotes: 0,
		discussedOn: ""
    }
    topics.push(newTopic);
    list.dispatchEvent(new CustomEvent('listUpdated')); 
    addForm.reset();
} 


//display the topics on the list
function displayTopic() {

    //filter the topics in two, past and next 
    //sort them by their rates if they are not discussed yet and by their dates if they are already discussed 
    const filterNext = topics.filter(topic => topic.discussedOn === "")
    .sort((topic1, topic2) => (topic2.upvotes - topic2.downvotes) - (topic1.upvotes - topic1.downvotes));

    const filterPast = topics.filter(topic => topic.discussedOn !== "")
    .sort((topic1, topic2) => topic2.discussedOn - topic1.discussedOn);
    
    //html for the next topic
    const html = filterNext.map(topic => {
        
        return `<article data-id="${topic.id}">
            <p>${topic.title}</p>
            <button type="button" class="archive"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"></path></svg></button>
            <p class="thumbs">
                <button type="button" class="thumb-up"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"></path></svg> ${topic.upvotes}
                </button>
                <button type="button" class="thumb-down"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.096c.5 0 .905-.405.905-.904 0-.715.211-1.413.608-2.008L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5"></path></svg> ${topic.downvotes}</button>
            </p>
         </article>

        `}).join('');

        //html for the past topic
        const html2 = filterPast.map(topic => {
            let date = new Date(Number(topic.discussedOn));
            let month = date.getMonth() + 1;
            let day = date.getDate();
            let year = date.getFullYear();
            let fullDate = `${day}/ ${month} / ${year}`;
        
            return `<article data-id="${topic.id}">
                <p>${topic.title}</p>
                <button type="button" class="delete"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg></button>
                <p>Discussed on ${fullDate}</button>
                </p>
             </article>
    
            `}).join('');

        nextTopic.innerHTML = html;
        pastTopic.innerHTML = html2;
}

//upvote a topic 
const upVote = (id) => {
    const topic = topics.find(topic => topic.id === id);
    topic.upvotes++;
    list.dispatchEvent(new CustomEvent('listUpdated'));
}

//downvote a topic
const downVote = (id) => {
    const topic = topics.find(topic => topic.id === id);
    topic.downvotes++;
    list.dispatchEvent(new CustomEvent('listUpdated'));
}

//archive a topic
const archiveTopic = (id) => {
    const topic = topics.find(topic => topic.id === id);
    topic.discussedOn = Date.now().toString();
    list.dispatchEvent(new CustomEvent('listUpdated'));
}

//delete a topic
const deleteTopic = (id) => {
    topics = topics.filter(topic => topic.id !== id);
    list.dispatchEvent(new CustomEvent('listUpdated'));
}

//handle clicks in the list
const handleClick = (e) => {
    const topicToUpdate = e.target.closest('article').dataset.id;
    const button = e.target.closest('button');
    if(button.matches('.thumb-up')) {
        upVote(topicToUpdate);
    }

    if(button.matches('.thumb-down')) {
        downVote(topicToUpdate);
    }

    if(button.matches('.archive')) {
        archiveTopic(topicToUpdate);
    }

    if(button.matches('.delete')) {
        deleteTopic(topicToUpdate)
    }
}

//event listeners
list.addEventListener('listUpdated', displayTopic);
list.addEventListener('listUpdated', updateLocalStorage);
addForm.addEventListener('submit', handleSubmitTopic);
list.addEventListener('click', handleClick);
//fetchData();
initializeFromLocalStorage()


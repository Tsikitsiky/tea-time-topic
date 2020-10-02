//fetch the data
export async function fetchData() {
    const response = await fetch(endPoint);
    const data = await response.json();
    localStorage.setItem('topics', JSON.stringify(data));
    return data;
}

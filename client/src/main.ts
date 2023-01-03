import user from '../assets/user.svg';
import bot from '../assets/robot.svg'

const form: HTMLFormElement  = document.querySelector('form');
const chatContainer: Element  = document.querySelector('.chat_container');

let loadingInterval: any;


const loader = (element: any) => {
  element.textContent = '';

  loadingInterval = setInterval(() => {
    element.textContent += '.';

    if (element.textContent === '....') {
      element.textContent = '';
    }
  } , 300)
};

const typetext = (element:any , text:string) => {
  let index:number = 0;

 let interval = setInterval(() => {
  if (index < text.length){
    element.innerHTML += text.charAt(index);
    index++;
  } else {
    clearInterval(interval);
  }
 }, 20)
};

const generateId = () => {
  const timestamp:number = Date.now();
  const randomNumber:number = Math.random();
  const hexString:string = randomNumber.toString(16);

  return `id-${timestamp}-${hexString}`;
}

const chatStripe = (isAi:boolean , value:any, uniqueId:string) => {
  return (
    `
      <div class="wrapper ${isAi && 'ai'}">
        <div class="chat">
          <div class=profile>
            <img 
            src=${isAi ? bot : user} 
            alt="${isAi ? 'bot' : 'user'}" 
            />
          </div>
          <div class="message" id=${uniqueId}>${value}</div>
        </div>
      </div>
    `
  )
}

const handleSubmit = async (e:any) => {
  e.preventDefault();

  const data:any = new FormData(form);

  //User's text field
  chatContainer.innerHTML += chatStripe(false, data.get('prompt'), "");

  form.reset();

  //Bot's text field
  const uniqueId:string = generateId();
  chatContainer.innerHTML += chatStripe(true, "" , uniqueId);

  chatContainer.scrollTop = chatContainer.scrollHeight;

  const messageDiv: HTMLElement = document.getElementById(uniqueId);
  loader(messageDiv);

  const response = await fetch("https://jarvees.onrender.com" , {
    method: 'POST' ,
    headers: {
      'Content-Type' : 'application/json'
    },
    body: JSON.stringify({
      prompt: data.get('prompt')
    })
  })

  clearInterval(loadingInterval);
  messageDiv.innerHTML = '';

  if (response.ok) {
    const data = await response.json();
    const parsedData = data.bot.trim();

    typetext(messageDiv, parsedData);
  } else {
    const err = await response.text();

    messageDiv.innerHTML = "Something went wrong";

    alert(err);
  }
}

form.addEventListener('submit' , handleSubmit);

// Submit query on enter key press
// form.addEventListener('keyup' , (e) => {
//   if (e.keyCode === 13) {
//     handleSubmit(e)
//   }
// });
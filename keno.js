const keno_numbersArray = [...document.getElementsByClassName("keno_click")];

const keno_div_2_ball_div = document.querySelector(".keno_div_2_ball_div");
const keno_div_2_first = document.querySelector(".keno_div_2_first");
const keno_addBet = document.getElementById('keno_add_bet');
const keno_betList = document.getElementById('keno_bet_list');
const keno_balance = document.getElementById('keno_balance');
const keno_win = document.getElementById('keno_win');
const keno_bet_quantity = document.getElementById('keno_bet_quantity');
const keno_bet_mony = document.getElementById('keno_bet_mony');
const keno_total_bet = document.getElementById('keno_total_bet');
const keno_auto_bet_button = document.getElementById('keno_auto_bet_button');
const keno_auto_bet_plus = document.getElementById('keno_auto_bet_plus');
const keno_auto_bet_minus = document.getElementById('keno_auto_bet_minus');
const keno_auto_bet_count = document.getElementById('keno_auto_bet_count'); 
const keno_circulationList = document.getElementById('keno_circulation');
const keno_fast = document.getElementById('keno_fast');
const keno_play_rules = document.getElementById('keno_play_rules');
const keno_repeat = document.getElementById('keno_repeat');
const keno_data = [];
let last_Index ;
let keno_bet = {};
let keno_total_balance = 1000;
let keno_count = 0;
let keno_auto_bet_number = 1;
let keno_how_much_beted = 0;
let keno_interval;
let keno_playingInterval;
let keno_waitingInterval;

let keno_min = 0; keno_sec = 45 ; 
let fast = 1;
let keno_bol = false;
let style;

keno_fast.addEventListener('click', () => fast = keno_sec);
keno_auto_bet_minus.addEventListener("click",keno_plus_minus);
keno_auto_bet_plus.addEventListener("click", keno_plus_minus);

keno_play_rules.addEventListener("click",(e) => {
  keno_bol = !keno_bol;
  const img = document.getElementById('keno_child-4');
  keno_bol === true ? img.style = "display: block;" : img.style = "display: none;"
});

function Keno_object(){
  this.bet = [];
  this.circulation = {};
  this.code = undefined;  
}

function keno_App(){
  
  keno_data.push(new Keno_object());
  last_Index = keno_data.length - 1;
  keno_auto_bet_button.addEventListener("click",random_number_to_bet);
  keno_div_2_ball_div.innerHTML = '';
  keno_div_2_first.innerHTML = '';
  keno_betList.innerHTML = '';
  keno_numbersArray.forEach( val => {
    val.id = '';
    val.style = 'background-color: rgb(92, 174, 92);';
    val.addEventListener("click",keno_chooseNumber);
  });
  keno_bet_quantity.innerHTML = "$0";
  keno_win.innerHTML = "$0";
  keno_how_much_beted = 0;
  keno_div_2_ball_div.style = 'display: flex; height:30px';
  keno_div_2_first.style = 'height: fit-content;';
  keno_addBet.addEventListener("click", keno_toBet);
  keno_timeInterval( keno_min, keno_sec, keno_playing);
}

 function keno_playing() { 
    let arr = [];
    keno_bet = {};
    
    clearInterval(keno_playingInterval);   
    keno_removeEventListeners();
    keno_numbersArray.forEach( val => { if(val.id === '') { val.style = 'background-color: rgb(92, 174, 92);'} });
    keno_playingInterval = setInterval( ()=>{
      if(arr.length >= 1) keno_rundom_balls_span(arr);
      let keno_rundom_numbr = keno_mathRandom(1,81);        
      if(keno_data[last_Index].circulation[keno_rundom_numbr] === undefined){
        keno_count++;
        arr.push(keno_rundom_numbr);
        checking_bets(keno_rundom_numbr);
        keyframes(keno_rundom_numbr,arr);
        keno_data[last_Index].circulation[keno_rundom_numbr] = keno_rundom_numbr;
        keno_numbersArray.map((val) =>{
          if(Number(val.innerHTML) === keno_rundom_numbr){
            return val.style = 'color: red; background-color:yellow;';
          }
          return val;
        });
        keno_time(0,keno_count);
      } 
      if(keno_count === 20) {
        clearInterval(keno_playingInterval);
        fast = 1;
        keno_repeat.addEventListener("click", keno_to_repeat_bets);
        keno_add_circulation();
        keno_count = 0;
        keno_counting_win();


      };
    },1500);
  
}
function keno_toBet(){
  if( (keno_total_balance - keno_input_value())  >= 0 && keno_input_value() > 0){
    if(Object.values(keno_bet).length  >= 1){
       keno_numbersArray.forEach( val => { 
          if(keno_bet[val.innerHTML] !== undefined){
            val.id = val.innerHTML;
            val.style = 'background-color:grey;';
          }
        });
      keno_data[last_Index]
      .bet.push(
        {
        beted_numbers: Object.values(keno_bet),
        money:  keno_input_value(),
        id: Math.random(),
       });
      how_much_beted("+" ,keno_input_value());
      keno_create_bets_element( keno_data[last_Index].bet,false);
    }
    else{
     return  alert(" Choose a number");
    }
    keno_bet = {};
  }else{
   return  alert('You donot have a enough money');
  }
   
 
}
function keno_to_repeat_bets(){ 
 for(let i = last_Index - 1; i >= 0; i--){

  if(keno_data[i].bet.length > 0){
    if( keno_total_balance - (keno_data[i].bet.length *  keno_input_value() )  >= 0){
      keno_data[i].bet.forEach(objects => {

        objects.beted_numbers.forEach( bet => keno_bet[bet] = bet);
        keno_toBet();
      });
      i = -1;
    }else{
      return alert("You have not enough money");
    }
      
   }
 }
  keno_repeat.removeEventListener("click", keno_to_repeat_bets);
  keno_create_bets_element(keno_data[last_Index].bet,false);
}
function keno_rundom_balls_span(array){
  keno_div_2_ball_div.innerHTML = '';
  keno_div_2_first.innerHTML = '';

  array.map( (num) =>{
    const element = document.createElement('span');
    element.className = 'keyframes';
    element.innerHTML = num;
    return keno_div_2_first.appendChild(element);
  });

}
function checking_bets(rundom){
  
  const  beted_element = [...document.getElementsByClassName('to_check_bets')];
  beted_element.map(span => {
    if(Number(span.innerHTML) === rundom){
      return span.style = "color: red; background-color: yellow;";
    }
  });
}
function keno_input_value(){
  return Number(document.getElementById("keno_bet_mony").value)
}
function keno_chooseNumber(e) {
  
  let number = Number(e.target.innerHTML);
 if(keno_bet[number] === undefined ){
    
    if(Object.values(keno_bet).length <= 9 ){
        keno_bet[number] = number;
       if(e.target.style.backgroundColor !== "blue" ) style = e.target.style.backgroundColor
          e.target.style = "background-color: blue"
    }else{
      alert("Add your bet it can't be more then 10");
     }
 }else {
    delete  keno_bet[number];
            e.target.style.backgroundColor = style;
 }
}
function how_much_beted(math,money){  
    if(math === "+"){
      keno_bet_quantity.innerHTML = `$:${keno_how_much_beted += money }`;
      keno_balance.innerHTML = keno_total_balance  -= money ;
    }else{
      keno_bet_quantity.innerHTML = `$:${keno_how_much_beted -= money }`;
      keno_balance.innerHTML = keno_total_balance  += money ;
    }
  
}
function keno_how_much_win(array){
  
  const value = array.reduce((arg,value) => {
   return arg + value.win;
  },0);
  keno_win.innerHTML = "$" + value;
  keno_balance.innerHTML = `$:${keno_total_balance += value}` ;

}
function keno_create_bets_element(bet_array,bool){
  keno_betList.innerHTML = '';
  bet_array.map((value,i) => {
    const div = document.createElement('div');
    div.id = "keno_bet_list_divs";
    div.innerHTML = 
    `
        <div >
         ${bool === true ? 
            ` <button   class="keno_clear_bet">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-award" viewBox="0 0 16 16">
                  <path d="M9.669.864 8 0 6.331.864l-1.858.282-.842 1.68-1.337 1.32L2.6 6l-.306 1.854 1.337 1.32.842 1.68 1.858.282L8 12l1.669-.864 1.858-.282.842-1.68 1.337-1.32L13.4 6l.306-1.854-1.337-1.32-.842-1.68zm1.196 1.193.684 1.365 1.086 1.072L12.387 6l.248 1.506-1.086 1.072-.684 1.365-1.51.229L8 10.874l-1.355-.702-1.51-.229-.684-1.365-1.086-1.072L3.614 6l-.25-1.506 1.087-1.072.684-1.365 1.51-.229L8 1.126l1.356.702z"/>
                  <path d="M4 11.794V16l4-1 4 1v-4.206l-2.018.306L8 13.126 6.018 12.1z"/>
                </svg>
            </button> `: 

            ` <button   class="keno_clear_bet">
                  <svg  id=${value.id} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3" viewBox="0 0 16 16">
                    <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5"/>
                  </svg>
            </button> `
          }
            <span id="keno_mony_span">$ ${bool === true ? value.win : value.money }</span>
        </div>

        <div  id="keno_beted_numbers" class="beted_${i}"> </div>
    `; 
     keno_betList.appendChild(div);
     value.beted_numbers.map(val => {
      const span = document.createElement('span');
      span.className = 'to_check_bets';
      span.innerHTML = val;
      document.querySelector(`.beted_${i}`).appendChild(span);
     });
  })
  

      const clear_button = [ ...document.getElementsByClassName("keno_clear_bet")];
      clear_button.forEach(el => el.addEventListener("click",clear_bet));
      Object.values(keno_data[last_Index].circulation).forEach( num => checking_bets(num));
}
function keno_counting_win(){
  if(keno_data[last_Index].bet.length > 0){
     keno_data[last_Index].bet.forEach( value => {
      let array = value.beted_numbers.filter( value => {
        if( keno_data[last_Index].circulation[value] !== undefined){
          return true;
        }
        return false;
       }).length;

      switch(value.beted_numbers.length) {
        case 1:
          if(array === 1){
            value.win = value.money * 3;
          }else{
            value.win = 0;

          }
          break;
        case 2:
          if(array === 1){
            value.win = value.money * 1;
          }else if(array === 2){
            value.win = value.money * 10;
          }else{
            value.win = 0;

          }
          break;
        case 3:
          if(array === 2){
            value.win = value.money * 2;
          }else if(array === 3){
            value.win = value.money * 45;
          }else{
            value.win = 0;

          }
        break;
        case 4:
          if(array === 2){
            value.win = value.money * 1;
          } 
          if(array === 3){
            value.win = value.money * 10;
          }
          if(array === 4){
            value.win = value.money * 100;
          }else{
            value.win = 0;

          }

        break;
        case 5:
          if(array === 2){
            value.win = value.money * 1;
          } 
          if(array === 3){
            value.win = value.money * 3;
          }
          if(array === 4){
            value.win = value.money * 30;
          }
          if(array === 5){
            value.win = value.money * 150;
          }else{
            value.win = 0;

          }
        break;
        case 6:
            
          if(array === 3){
            value.win = value.money * 2;
          }
          if(array === 4){
            value.win = value.money * 15;
          }
          if(array === 5){
            value.win = value.money * 60;
          }
          if(array === 6){
            value.win = value.money * 500;
          }else{
            value.win = 0;

          }
        break;
        case 7:
          if(array === 0){
            value.win = value.money * 1;
          }
          if(array === 3){
            value.win = value.money * 2;
          }
          if(array === 4){
            value.win = value.money * 4;
          }
          if(array === 5){
            value.win = value.money * 20;
          }
          if(array === 6){
            value.win = value.money * 80;
          }
          if(array === 7){
            value.win = value.money * 1000;
          }else{
            value.win = 0;

          }
        break;
        case 8:
          if(array === 0){
            value.win = value.money * 1;
          }
          if(array === 4){
            value.win = value.money * 5;
          }
          if(array === 5){
            value.win = value.money * 15;
          }
          if(array === 6){
            value.win = value.money * 50;
          }
          if(array === 7){
            value.win = value.money * 200;
          }
          if(array === 8){
            value.win = value.money * 2000;
          }else{
            value.win = 0;

          }
        break;
        case 9:
          if(array === 0){
            value.win = value.money * 2;
          }
          if(array === 4){
            value.win = value.money * 2;
          }
          if(array === 5){
            value.win = value.money * 10;
          }
          if(array === 6){
            value.win = value.money * 25;
          }
          if(array === 7){
            value.win = value.money * 125;
          }
          if(array === 8){
            value.win = value.money * 1000;
          }
          if(array === 9){
            value.win = value.money * 5000;
          }else{
            value.win = 0;

          }
        break;
        case 10:
            if(array === 0){
              value.win = value.money * 2;
            }
            if(array === 5){
              value.win = value.money * 5;
            }
            if(array === 6){
              value.win = value.money * 30;
            }
            if(array === 7){
              value.win = value.money * 100;
            }
            if(array === 8){
              value.win = value.money * 300;
            }
            if(array === 9){
              value.win = value.money * 2000;
            }
            if(array === 10){
              value.win = value.money * 10000;
            }else{
              value.win = 0;

            }
          break;
        default:
          "There are not  bet"
      }

    });
  }
 
  keno_create_bets_element(keno_data[last_Index].bet,true);
  keno_how_much_win(keno_data[last_Index].bet);
 
}
function clear_bet(e){
  if(e.target.id !== ''){
    keno_data[last_Index].bet = keno_data[last_Index].bet.filter(obj => {
      if( obj.id !== Number(e.target.id) ){
      
        return true;
      }
      how_much_beted("-",obj.money);
      return false;
    });
  
    keno_create_bets_element(keno_data[last_Index].bet);
  }
  
}
function keno_timeInterval(keno_min,keno_sec,keno_func){
  clearInterval(keno_interval);
  keno_interval = setInterval(()=> {
    keno_sec-= fast;
    if(keno_sec < 1 && keno_min !== 0){
        keno_min--;
        keno_sec = 59;
    }

    keno_time(keno_min,keno_sec);

    if(keno_min < 1 && keno_sec < 1) {
        clearInterval(keno_interval);
        keno_func();
    };

  },1000);
}
function keno_add_circulation(){
  keno_data[last_Index].code = 220317 + keno_data.length;
    const li = document.createElement('li');
    li.innerHTML = `<span > ${keno_data[last_Index].code} </span>
                    <span > ${Object.values(keno_data[last_Index].circulation).join(' ')} </span>`;
    document.getElementById('keno_circulation').appendChild(li);
  keno_min = 0;
  keno_timeInterval(0,15,keno_App);
}
function keno_removeEventListeners(){
  keno_repeat.removeEventListener("click", keno_to_repeat_bets);
  keno_numbersArray.forEach( val => val.removeEventListener("click",keno_chooseNumber));
  keno_auto_bet_button.removeEventListener("click",random_number_to_bet);
  keno_addBet.removeEventListener("click",keno_toBet);

}
function keno_mathRandom(min,max){
  return Math.floor(Math.random() * (max - min) + min);
}
function random_number_to_bet(){
  
  if( (keno_total_balance - keno_input_value())  >= 0){
    for(let i = 0; i < keno_auto_bet_number;){
      let rundom =  keno_mathRandom(1,81);
      if(keno_bet[rundom] === undefined) {
         keno_bet[rundom] = rundom;
         i++;
        }
        keno_numbersArray.forEach(val => {
         if(val.innerHTML === String(rundom)){
           val.id = 'grey';
         }
        })
   
     }
       
     keno_toBet();
  }else{
    alert('You donot have enough money!');

  }
  

}
function keno_time (keno_min,keno_sec){
  keno_sec < 0 ? keno_sec = 0 : keno_sec;
  document.getElementById("keno_min").innerHTML = keno_min < 10 ? `0${keno_min}:`: keno_min;
  document.getElementById("keno_sec").innerHTML = keno_sec < 10 ? `0${keno_sec}` : keno_sec;
}
function keno_plus_minus(e){
    if(e.target.innerHTML === '-' && keno_auto_bet_number > 1) keno_auto_bet_number--;
    else if(e.target.innerHTML === "+" && keno_auto_bet_number < 10)  keno_auto_bet_number++;
    keno_auto_bet_count.innerHTML = `Auto ${keno_auto_bet_number}`;
}
 function keyframes(rundam_number,array){
  
  keno_div_2_ball_div.innerHTML = `<span id="keno_rundom_ball" class="keyframes">${rundam_number}</span>`
  const style = document.createElement('style');
  style.type = 'text/css';
  document.head.appendChild(style);
  let width = 330;
  const element = document.getElementById('keno_rundom_ball');

  if(array.length <= 10 ){
   
    var keyframes = `
    @keyframes example {
  
      100%{right:${width - ( (30 * array.length ) - 15) }px; }
      
      0% { transform: rotate( 0deg ) scale( 1.5 ); }
  
      100% { transform: rotate( -360deg ) scale( 1 ); }
      
    }`;
  }else{
    keno_div_2_ball_div.style = ' height:60px';
    keno_div_2_first.style = "height:60px;  align-content: space-between;";
    element.style = "position:absolute; bottom:0; "  ;
    var keyframes = `
    @keyframes example {
      100%{right:${width - (30 * (array.length - 10) ) - 15}px; }
      
      0% { transform: rotate( 0deg ) scale( 1.5 ); }
  
      100% { transform: rotate( -360deg ) scale( 1 ); }
      
    }`;
  }

  style.sheet.insertRule(keyframes, style.sheet.cssRules.length);

  element.style.animation = 'example 3s infinite';

  if(array.length === 20) {
    keno_rundom_balls_span(array);
    keno_div_2_ball_div.style = 'display:none';
  };
  
  
}

  


keno_App();




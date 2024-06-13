var divs=new Array();
var counter=new Array();
var block=new Array;
var error=false;
var start=true;
var speed=750;
var rotator_array=new Array();
var rotator_counter=0;
var is_game_stopped=false;
var active_color=new String;
var color_array=['red','green','blue','purple','yellow'];
var score=0;
var anti_spam=false;
var pressed_keys={
    ArrowLeft: false,
    ArrowRight: false,
    ArrowDown:false
};
var interval;
var flag=true;
function game()
{
    
    counter=random_figure();
    is_game_stopped=false;
    let is_place_for_new_block=true;
    for(let element of counter)
    {
        if(divs[element].classList.contains('block'))
        {
            is_place_for_new_block=false;
        }
    }
    if(is_place_for_new_block)
    {
        play();
    }
    else
    {
        console.log('LOSE');
    }
}
function random_figure() 
{
    let random=Math.floor((Math.random()*5));
    let figure=[0,0,0,0];
    let rotator0,rotator1,rotator2,rotator3;
    rotator_counter=0;
    switch(random)
    {
        case 0:
        {
            figure=[4,5,14,15];
            rotator0=[0,0,0,0];
            rotator1=[0,0,0,0];
            rotator2=[0,0,0,0];
            rotator3=[0,0,0,0];
            active_color='red';
            break;
        }
        case 1:
        {
            figure=[3,4,5,6];
            rotator0=[2,11,20,29];
            rotator1=[-2,-11,-20,-29];
            rotator2=[2,11,20,29];
            rotator3=[-2,-11,-20,-29];
            active_color='purple';
            break;
        }
        case 2:
        {
            figure=[4,14,15,16];
            rotator0=[2,-9,0,9];
            rotator1=[20,11,0,-11];
            rotator2=[-2,9,0,-9];
            rotator3=[-20,-11,0,11];
            active_color='yellow';
            break;
        }
        case 3:
        {
            figure=[5,14,15,16];
            rotator0=[11,-9,0,9];
            rotator1=[9,11,0,-11];
            rotator2=[-11,9,0,-9];
            rotator3=[-9,-11,0,11];
            active_color='green';
            break;
        }
        case 4:
        {
            figure=[4,5,15,16];
            rotator0=[-9,0,-11,-2];
            rotator1=[9,0,11,2];
            rotator2=[-9,0,-11,-2];
            rotator3=[9,0,11,2];
            active_color='blue';
            break;
        }
    }
    rotator_array=[rotator0,rotator1,rotator2,rotator3];
    return figure;
}
function play(){
    if(is_game_stopped==false)
    {
        let play_error=false;
        for(let element of counter)
        {
            if(element>=190)
            {
                play_error=true;
            }
            else if(element<190 && divs[element+10].classList.contains('block'))
            {
                play_error=true;
            }
        }
        if(play_error==true)
        {
            // $(divs[counter-10]).addClass('block');
            for (const element of counter){
                $(divs[element]).addClass('block');
                // $(divs[element]).css('background-color',active_color);
                // $(divs[element]).removeClass('active');
                // $(divs[element]).removeClass(active_color);
            }
            // let block_sound=new Audio('block_sound.wav');
            // block_sound.play();
            start=true;
            check();
            game();
        }
        else if(start==true)
        {
            for (let i=0;i<4;i++){
                // $(divs[counter[i]]).addClass('active');
                $(divs[counter[i]]).addClass(active_color);
            }  
            start=false;
            setTimeout(function(){
                play();
            },speed);
        }
        else
        {
            move(10);
        }
    }
    else
    {
        return;
    }
}
function move(a)
{
    for (let i=0;i<4;i++){
        // $(divs[counter[i]]).removeClass('active');
        $(divs[counter[i]]).removeClass(active_color);
        counter[i]=counter[i]+a;
    }
    for (let i=0;i<4;i++){
        // $(divs[counter[i]]).addClass('active');
        $(divs[counter[i]]).addClass(active_color);
    }
    if(a==10)
    {
        setTimeout(function(){
            play();
        },speed);
    }
}
function collision(a)
{
    let local_error=false;
    for (let element of counter){
        if(element>0)
        {
            if((element+a)%10==0 && a==1)
            {
                local_error=true;
            }
            else if((element+a)%10==9 && a==-1)
            {
                local_error=true;
            }
            else if(element+a>0) //Likwidacja błędu
            {
                if(divs[element+a].classList.contains('block'))
                {
                local_error=true;
                }
            }
        }
        else
        {
            local_error=true;
        }
    }
    return local_error;
}
function check()
{
    let i=190;
    let blocks_to_move=new Array();
    while(i>=0)
    {
        let divs_to_check=divs.slice(i,i+10);
        let is_the_row_full=true;
        for(let element of divs_to_check)
        {
            if(element.classList.contains('block')==false)
            {
                is_the_row_full=false;
            }
        }
        if(is_the_row_full==true)
        {
            score=score+100;
            update_score();
            for(let j=i;j<i+10;j++)
            {
                $(divs[j]).removeClass();
                setTimeout(function(){
                    $(divs[j]).css('background','white');
                },100);
                setTimeout(function(){
                    $(divs[j]).css('background','rgb(29, 29, 29)');
                },200);
            }
            blocks_to_move.push(i-1);
        }
        i=i-10;
    }
    if(blocks_to_move.length!=0)
    {
        setTimeout(function(){
            for(let i=blocks_to_move.length;i>=0;i--){
                let starting_block=blocks_to_move[i];
                for(let j=starting_block;j>=0;j--)
                {
                    if(divs[j].classList.contains('block'))
                {
                    $(divs[j]).removeClass('block');
                    for(let element of color_array)
                    {
                        if(divs[j].classList.contains(element))
                        {
                            $(divs[j]).removeClass(element);
                            $(divs[j+10]).addClass(element);
                        }
                    }
                    $(divs[j+10]).addClass('block');
                }
                }
            }
        },200);
    }
}
function update_score()
{
    $('#score').html('Your score: '+score);
}
function rotate(){{
    let rotate_error=false;
    let active_rotator=rotator_array[rotator_counter];
    for(let i=0;i<4;i++)
    {
        if((counter[i]%10>5 && (counter[i]+active_rotator[i])%10==0) || (counter[i]%10<5 && (counter[i]+active_rotator[i])%10>7) || divs[counter[i]+active_rotator[i]].classList.contains('block'))
        {
            rotate_error=true;
        }
    }
    if(rotate_error==false)
    {
        let rotate_sound=new Audio('rotate_sound.wav');
        rotate_sound.play();
        for(let i=0;i<4;i++)
        {
            // $(divs[counter[i]]).removeClass('active');
            $(divs[counter[i]]).removeClass(active_color);
            counter[i]=counter[i]+active_rotator[i];
        }
        for (let i=0;i<4;i++)
        {
        // $(divs[counter[i]]).addClass('active');
        $(divs[counter[i]]).addClass(active_color);
        }
        rotator_counter++;
    } 
    if(rotator_counter>3)
    {
        rotator_counter=0;
    }
}};
function stop_game()
{
    let new_icon="";
    if(is_game_stopped){
        new_icon='<i class="icon-pause"></i>';
        is_game_stopped=false;
    }
    else{
        is_game_stopped=true;
        new_icon='<i class="icon-play"></i>';
    }
    setTimeout(function(){
        play(); 
    },speed);
    $('#pause').fadeOut(200);
    setTimeout(function(){
        $('#pause').fadeIn(300).html(new_icon);
    },200);
}
function reset_game()
{
    is_game_stopped=true;
    for(let element of divs)
    {
        $(element).removeClass();
        // $(element).removeClass('active');
        $(element).removeClass(active_color);
    }
    score=0;
    update_score();
    $('#pause').fadeOut(200);
    setTimeout(function(){
        $('#pause').fadeIn(300).html('<i class="icon-pause"></i>');
    },200);
    start=true;
    setTimeout(function(){
        game(); 
    },speed);
}
function start_game()
{
    for(let i=0;i<200;i++){
        $('#board').append('<div></div>');
    };
    divs=Array.from(document.querySelectorAll('#board div'));
    setTimeout(function(){
        game();
    },1500);
    window.addEventListener('keydown',function(event){
        let a=event.key;
    })
    window.addEventListener('keydown',function(event){
        let a=event.key;
        if((a=='ArrowRight' || a=='ArrowLeft') && !is_game_stopped){
            pressed_keys[event.key]=true;
            if(!event.repeat){
                keypress_event();
            }
            else{
                if(flag){
                    interval=setInterval(function(){
                        keypress_event();
                    },75)
                    flag=false;
                }
            }
        }
        else if(a==' ' && !event.repeat)
        {
            rotate();
        }
        else if(a=='ArrowDown')
        {
            speed=100;
        }
        // {
        //     pressed_keys['ArrowUp']=false;
        //     keypress_event();
        // }
    });
    window.addEventListener('keyup',function(event){
        let a=event.key;
        if((a=='ArrowRight' || a=='ArrowLeft') && !is_game_stopped){
            pressed_keys[event.key]=false;
            clearInterval(interval);
            flag=true;
        }
        if(a=='ArrowDown')
        {
            speed=750;
        }
        else if(a=='r')
        {
            if(!anti_spam){
                reset_game();
                spam_blockade();
            }
        }
        else if(a=="p")
        {
            if(!anti_spam){
                stop_game();
                spam_blockade();
            }
        }
    });
    $('#reset').on('click', function(){
        reset_game();
    });
    $('#pause').on('click', function(){
        stop_game();
    });
}
function keypress_event(){
        for (const [key, value] of Object.entries(pressed_keys)) {
            if(key=='ArrowRight' && value){
                error=collision(1);
                if(error==false){
                    move(1);
                }
                else{
                    error=false;
                }
            }
            else if(key=='ArrowLeft' && value)
            {
                error=collision(-1);
                if(error==false)
                {
                    move(-1);
                }
                else
                {
                    error=false;
                }
            }
          }
    }
        // if(a=='ArrowRight'){
        //     error=collision(1);
        //     if(error==false){
        //         move(1);
        //     }
        //     else{
        //         error=false;
        //     }
        // }
        // else if(a=='ArrowLeft')
        // {
        //     error=collision(-1);
        //     if(error==false)
        //     {
        //         move(-1);
        //     }
        //     else
        //     {
        //         error=false;
        //     }
        // }
        // else if(a=='ArrowDown')
        // {
        //     speed=100;
        // }
        // else if(a==' ')
        // {
        //     rotate();
        // }
    // if(a=='ArrowRight')
    //     {
    //         error=collision(1);
    //         if(error==false)
    //         {
    //             move(1);
    //         }
    //         else
    //         {
    //             error=false;
    //         }
    //     }
    //     else if(a=='ArrowLeft')
    //     {
    //         error=collision(-1);
    //         if(error==false)
    //         {
    //             move(-1);
    //         }
    //         else
    //         {
    //             error=false;
    //         }
    //     }
    //     else if(a=='ArrowDown')
    //     {
    //         speed=100;
    //     }
    //     else if(a==' ')
    //     {
    //         rotate();
    //     }
function spam_blockade(){
    anti_spam=true;
    setTimeout(function(){
        anti_spam=false;
    },500)
}
$(document).ready(function() {
    $('#start').on('click',function(){
        $('#title_screen').slideUp('slow');
        $('#game').css('display', 'flex');
        start_game();
    });
});
// DO ZROBIENIA !!!!!!!!!!!!!!!
// Wygląd
// Może dźwięki
// Wynik z MAC
//efekty wizualne

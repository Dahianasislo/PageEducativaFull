// record and score
const recordDiv=document.getElementById('record');
let record=localStorage.getItem('record');
if(record!=null) recordDiv.innerHTML='rekord: '+record;
const scoreDiv=document.getElementById('score');
let score=0;
// play again button
const playAgainButton=document.getElementById('playAgainButton');
// canvas
const canvas=document.querySelector('canvas');
const ctx=canvas.getContext('2d');
// draw parametrs
const rectMinWidth=10;
const rectMaxWidth=110;
const nrOfRectsInRow=20; // must be even
const sumOfRectsWidthInRow=1000;
const spaceBetweenRects=5;
const rowHeight=40;
const nrOfRows=7;
const spaceBetweenRows=5;
const borderT=80;
const borderRBL=5;
const spaceBetweenLowestRowAndPaddle=180;
const paddleWidth=200;
const paddleHeight=10;
const ballRadius=8;
const boardWidth=2*borderRBL+(nrOfRectsInRow-1)*spaceBetweenRects+sumOfRectsWidthInRow;
const boardHeight=borderT+borderRBL+nrOfRows*(rowHeight+spaceBetweenRows)-spaceBetweenRows+spaceBetweenLowestRowAndPaddle+paddleHeight;
// canvas
canvas.width=boardWidth;
canvas.height=boardHeight;
// colors
const backgroundColor='black';
const rectColor1='blue';
const rectColor2='green';
const rectColor3='yellow';
const rectColor4='orange';
const rectColor5='red';
const ballColor='white';
const paddleColor='dodgerblue';
// game variables
let currentNrOfRects=nrOfRectsInRow*nrOfRows;
const rects=new Array(nrOfRectsInRow*nrOfRows);
for(let i=0;i<rects.length;i++) rects[i]=new Array(6);
let paddleX;
const paddleY=boardHeight-borderRBL-paddleHeight;
let ballX;
let ballY;
let ballSpeed;
let ballSpeedX;
let ballSpeedY;
const ballMaxSpeed=4;
const ballAcc=0.15;
let ballDirX;
let ballDirY;
newGame();
function tick()
{
	// saving last ball position
	let lastBallX=ballX;
	let lastBallY=ballY;
	// moving the ball
	if(ballDirX) ballX+=ballSpeedX;
	else ballX-=ballSpeedX;
	if(ballDirY) ballY+=ballSpeedY;
	else ballY-=ballSpeedY;
	// bound (wall)
	if(ballX-ballRadius<=0 || ballX+ballRadius>=boardWidth)
	{
		// ball acceleration
		if(ballSpeed<ballMaxSpeed)
		{
			ballSpeed+=ballAcc;
			ballSpeedX+=ballAcc/2;
			ballSpeedY+=ballAcc/2;
		}
	}
	if(ballX-ballRadius<=0) ballDirX=true;
	if(ballX+ballRadius>=boardWidth) ballDirX=false;
	if(ballY-ballRadius<=0)
	{
		ballDirY=true;
		// ball acceleration
		if(ballSpeed<ballMaxSpeed)
		{
			ballSpeed+=ballAcc;
			ballSpeedX+=ballAcc/2;
			ballSpeedY+=ballAcc/2;
		}
	}
	// bound (paddle)
	if(ballX>=paddleX && ballX<=paddleX+paddleWidth && ballY+ballRadius>=paddleY && ballY<=paddleY)
	{
		let placeOfBounce=ballX-paddleX-paddleWidth/2;
		ballSpeedX=(Math.abs(placeOfBounce)/paddleWidth*2+Math.random()*2)/3*ballSpeed;
		ballSpeedY=ballSpeed-ballSpeedX;
		if(placeOfBounce<0) ballDirX=false;
		else ballDirX=true;
		ballDirY=false;
		// ball acceleration
		if(ballSpeed<ballMaxSpeed)
		{
			ballSpeed+=ballAcc;
			ballSpeedX+=ballAcc/2;
			ballSpeedY+=ballAcc/2;
		}
	}
	// lose
	if(ballY+ballRadius>boardHeight) newGame();
	// break the rect
	for(let i=0;i<rects.length;i++)
	{
		// checking if the ball is in rect
		if(rects[i][4] && ballX+ballRadius>=rects[i][0] && ballY+ballRadius>=rects[i][1] && ballX-ballRadius<=rects[i][0]+rects[i][2] && ballY-ballRadius<=rects[i][1]+rects[i][3])
		{
			// bound
			if(lastBallX+ballRadius>rects[i][0] && lastBallX-ballRadius<rects[i][0]+rects[i][2]) ballDirY=!ballDirY;
			else ballDirX=!ballDirX;
			// ball acceleration
			if(ballSpeed<ballMaxSpeed)
			{
				ballSpeed+=ballAcc;
				ballSpeedX+=ballAcc/2;
				ballSpeedY+=ballAcc/2;
			}
			rects[i][4]=false;
			score+=rects[i][5];
			currentNrOfRects--;
			scoreDiv.innerHTML='wynik: '+score;
			// new record
			if(score>record)
			{
				record=score;
				recordDiv.innerHTML='rekord: '+record;
				localStorage.setItem('record', record);
			}
		}
	}
	if(currentNrOfRects==0) newGame();
}
function draw()
{
	// drawing background
	ctx.fillStyle=backgroundColor;
	ctx.fillRect(0, 0, boardWidth, boardHeight);
	// drawing rects
	for(let i=0;i<nrOfRectsInRow*nrOfRows;i++)
	{
		if(rects[i][4])
		{
			// rect color
			if(rects[i][5]==1) ctx.fillStyle=rectColor1;
			else if(rects[i][5]==2) ctx.fillStyle=rectColor2;
			else if(rects[i][5]==3) ctx.fillStyle=rectColor3;
			else if(rects[i][5]==4) ctx.fillStyle=rectColor4;
			else ctx.fillStyle=rectColor5;
			// drawing rect
			ctx.fillRect(rects[i][0], rects[i][1], rects[i][2], rects[i][3]);
		}
	}
	// drawing paddle
	ctx.fillStyle=paddleColor;
	ctx.fillRect(paddleX, paddleY, paddleWidth, paddleHeight);
	// drawing ball
	ctx.fillStyle=ballColor;
	ctx.beginPath();
	ctx.arc(ballX, ballY, ballRadius, 0, Math.PI*2, true);
	ctx.fill();
	ctx.closePath();
}
function paddleMove(e)
{
	paddleX=e.offsetX-paddleWidth/2;
	if(paddleX<0) paddleX=0;
	if(paddleX+paddleWidth>boardWidth) paddleX=boardWidth-paddleWidth;
}
function newGame()
{
	// score
	score=0;
	scoreDiv.innerHTML='wynik: '+score;
	// rects
	currentNrOfRects=nrOfRectsInRow*nrOfRows;
	let rectLocationX=borderRBL;
	let rectLocationY=borderT;
	let rowNr=0;
	let rectInRowNr=0;
	let index;
	while(rowNr<nrOfRows)
	{
		while(rectInRowNr<nrOfRectsInRow)
		{
			index=rowNr*nrOfRectsInRow+rectInRowNr;
			rects[index][0]=rectLocationX;
			rects[index][1]=rectLocationY;
			if((index+1)%2==1) rects[index][2]=Math.round(Math.random()*(rectMaxWidth-rectMinWidth)+rectMinWidth);
			else rects[index][2]=rectMaxWidth+rectMinWidth-rects[index-1][2];
			rects[index][3]=rowHeight;
			rects[index][4]=true;
			if(rects[index][2]<(rectMaxWidth-rectMinWidth)/5+rectMinWidth) rects[index][5]=5;
			else if(rects[index][2]<(rectMaxWidth-rectMinWidth)/5*2+rectMinWidth) rects[index][5]=4;
			else if(rects[index][2]<(rectMaxWidth-rectMinWidth)/5*3+rectMinWidth) rects[index][5]=3;
			else if(rects[index][2]<(rectMaxWidth-rectMinWidth)/5*4+rectMinWidth) rects[index][5]=2;
			else rects[index][5]=1;
			rectLocationX+=rects[index][2]+spaceBetweenRows;
			rectInRowNr++;
		}
		rectLocationX=borderRBL;
		rectLocationY+=rowHeight+spaceBetweenRows;
		rowNr++;
		rectInRowNr=0;
	}
	// paddle
	paddleX=boardWidth/2-paddleWidth/2;
	// ball
	ballX=boardWidth/2;
	ballY=boardHeight-borderRBL-paddleHeight-ballRadius;
	ballSpeed=2;
	ballSpeedX=Math.random()*ballSpeed;
	ballSpeedY=ballSpeed-ballSpeedX;
	ballDirX=Boolean(Math.round(Math.random()));
	ballDirY=false;
}
// ticking
const tickingInterval=setInterval(tick, 10);
const drawingInterval=setInterval(draw, 10);
// control
playAgainButton.addEventListener('click', newGame);
canvas.addEventListener('mousemove', paddleMove);
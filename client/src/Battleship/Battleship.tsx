// import { findByLabelText } from '@testing-library/react';
// import { GraphQLID } from 'graphql';
// import { relative } from 'node:path/win32';
import React, {useRef, useEffect, useState, MouseEvent} from 'react';
// import { createEmitAndSemanticDiagnosticsBuilderProgram } from 'typescript';
import battleshipImage from './battleship.png';
import carrierImage from './carrier.png';
import destroyerImage from './destroyer.png'
import { v4 as uuidv4 } from 'uuid';
// import ReactDOM from 'react-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import  _ from 'lodash'
import { faArrowUp, faArrowLeft, faArrowRight, faArrowDown, faRotateLeft, faRotateRight, faCircleXmark } from '@fortawesome/free-solid-svg-icons'
// import reportWebVitals from '../reportWebVitals';
// import { cp } from 'node:fs';
// Define mutation
import { gql, useMutation } from '@apollo/client';


export default function BattleShip() {
    const [gameState, setGameState] = useState({
                                    grid: [
                                        [{row:0,column:0,hit:false,firedAt:false}]
                                    ],
                                    battleShip: [
                                                 {hit:false, pos:{x:0, y:0}},
                                                 {hit:false, pos:{x:0, y:0}},
                                                 {hit:false, pos:{x:0, y:0}},
                                                 {hit:false, pos:{x:0, y:0}}
                                                ],
                                    carrier :   [
                                                {hit:false, pos:{x:0, y:0}},
                                                {hit:false, pos:{x:0, y:0}},
                                                {hit:false, pos:{x:0, y:0}},
                                                {hit:false, pos:{x:0, y:0}},
                                                {hit:false, pos:{x:0, y:0}}
                                                ],
                                    destroyer:  [
                                                {hit:false, pos:{x:0, y:0}},
                                                {hit:false, pos:{x:0, y:0}},
                                    ],
                                    gameGrid:[[]],
                                    battleShipsPlaced: false,
                                    carrierPlaced: false,
                                    destroyerPlaced: false, 
                                    placingBattleShip: false,
                                    placingCarrier: false,
                                    placingDestroyer: false,
                                    manipulatingBattleShip: false,
                                    battleShipVertical: false,
                                    carrierVertical: false,
                                    destroyerVertical:false,
                                    gameStarted: false, 
                                    });
 
    // const POST_GAME_ARRAY = gql`


    const POST_GAME_ARRAY= gql`
    mutation($payload:Grid!) {
        postGameArray(payload: $payload)
    }
    `

    const POST_UUID= gql`
    mutation($payload:String!) {
        postUUID(payload: $payload)
    }
    `
    // const hello = {'hello': "hello"} 
    const send = ()=> {
        const element = {
            row: 0,
            column:0,
            hit: true,
            firedAt: true
        }

        let obj2 = {data: [{}]}
        
        for(var i=0; i<numGridEdge; i++) {
            let obj1 ={data: [{}]};
            obj1.data = gameState.grid[i]
            obj2.data.push(obj1) ;
        }
        obj2.data.shift();
        // consol.log(obj2)
        // const arr2 =[arr1]
        // const uuid = uuidv4();
        // console.log('uuid:', JSON.stringify(uuid))
        // postUUID({variables: {payload: uuid}});
        // }
        postGameArray({
            variables: {payload: obj2}
        })
    }

    function JoinGame() {
        
        const [postUUID, { data, loading, error }] = useMutation(POST_UUID);
        const uuid = uuidv4();
        console.log(uuid)
        console.log('data', data);

        if(data) {
            return(
                <div>{data}</div>
            )
        }
      
        return (
          <div>
             <button onClick={()=>postUUID({variables: {payload: uuid}})}>
                join Game
             </button>
          </div>
        );
      }

    // const [postUUID, { data, loading, error }] = useMutation(POST_UUID);
    // console.log('post uuid data:', data);
    // // Pass mutation to useMutation
    const [postGameArray] = useMutation(POST_GAME_ARRAY);
    
    // console.log(data)
   

    useEffect(()=>{
   
        let gameGrid = Array(numGridEdge).fill(null).map(row => new Array(numGridEdge).fill(null))
        for(var i =0; i<numGridEdge;i++){
            for(var j=0; j<numGridEdge; j++){
                let  obj={column:0, row:0, hit:false, firedAt:false}
                obj.row = i;
                obj.column=j
                gameGrid[i][j] = obj
            }
        }
        
        setGameState({...gameState, grid: gameGrid});
        // postGameArray({ variables: { payload: 'hello'} });
        // postGameArray({ variables: { payload: 'hello'} });
    //    MyComponent();

    },[])

    const numGridEdge =8;
    const gridEdgeLength=window.innerHeight*.75;
    const delta = (gridEdgeLength)/numGridEdge;
    const carrierLength = 5;
    const destroyerLength = 2;
    
    const containerStyles = {
        height: window.innerHeight,
        display: 'flex',
        justifyContent: 'center',
        alignItems:'center',
    
    }

    const gameGridStyles = {
        width: window.innerHeight *.75,
        height: window.innerHeight * .75,
        border: '1px solid red  ',
        display: 'grid', 
        gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr',
        gridTemplateRows: '1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr',
        position: 'relative',
        transform: `translateX(${delta*2.5}px)`
    } as React.CSSProperties;

    const gridElementStyles = {
        width: '100%',
        height: '100%',
        border: '1px solid black',
        gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr',
        gridTemplateRows: '1fr 1fr 1fr'
    }

    const shipYardStyles = {
        width: window.innerHeight*.75 * (5/8),
        height: window.innerHeight*.75 * (3/8),
        position: 'absolute',
        bottom: '25px ',
        left: '25px',
        border: '1px solid black',

    } as React.CSSProperties;

    const battleshipStyle = {
        width: window.innerHeight*.75 * (4/8),
        height: window.innerHeight*.75 * (3/8) /3 ,
        gridRowStart: 1,
        gridColumnStart: 1,
        backgroundImage: `url(${battleshipImage})`,
        backgroundSize: 'contain',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
       
    }

    const gridBattleShipStyle = {
        position: 'absolute',
        top: gameState.battleShipVertical? (gameState.battleShip[0].pos.y * delta - delta) :  (gameState.battleShip[0].pos.y * delta) ,
        left: gameState.battleShipVertical? (gameState.battleShip[0].pos.x*delta) : (gameState.battleShip[0].pos.x*delta),
        width: window.innerHeight*.75 * (4/8),
        height: window.innerHeight*.75 * (3/8) /3 ,
        backgroundImage: `url(${battleshipImage})`,
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat', 
        backgroundSize: '100% 60%',
        transform: `rotate(${gameState.battleShipVertical? 90 : 0}deg) `,
        transformOrigin:'0% 100%',
        zIndex: gameState.gameStarted? -1 : 0
    } as React.CSSProperties;

    const gridCarrierStyle = {
        position: 'absolute',
        top: gameState.carrierVertical? (gameState.carrier[0].pos.y * delta - delta) :  (gameState.carrier[0].pos.y * delta) ,
        left: gameState.carrierVertical? (gameState.carrier[0].pos.x*delta) : (gameState.carrier[0].pos.x*delta),
        width: window.innerHeight*.75 * (5/8),
        height: window.innerHeight*.75 /8,

        backgroundImage: `url(${carrierImage})`,
        backgroundSize: 'contain',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat', 
        transform: `rotate(${gameState.carrierVertical? 90 : 0}deg) `,
        transformOrigin:'0% 100%',
        zIndex: gameState.gameStarted? -1 : 0
    } as React.CSSProperties;

    const gridDestroyerStyle = {
        position: 'absolute',
        top: gameState.destroyerVertical? (gameState.destroyer[0].pos.y * delta - delta) :  (gameState.destroyer[0].pos.y * delta) ,
        left: gameState.destroyerVertical? (gameState.destroyer[0].pos.x*delta) : (gameState.destroyer[0].pos.x*delta),
        width: window.innerHeight*.75 * (destroyerLength/numGridEdge),
        height: window.innerHeight*.75/numGridEdge,
        backgroundImage: `url(${destroyerImage})`,
        backgroundSize: '100% 60%',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        transform: `rotate(${gameState.destroyerVertical? 90 : 0}deg) `,
        transformOrigin:'0% 100%',
        zIndex: gameState.gameStarted? -1 : 0
    } as React.CSSProperties;


    const carrierStyle = {
        width: window.innerHeight*.75 * (5/8),
        height: window.innerHeight*.75 * (3/8) /3 ,
        gridRowStart: 2,
        gridColumnStart: 1,
        backgroundImage: `url(${carrierImage})`,
        backgroundSize: 'contain',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
    }
    const destroyerStyle = {
        width: window.innerHeight*.75 * (2/8),
        height: window.innerHeight*.75 * (3/8) /3 ,
        gridRowStart: 3,
        gridColumnStart: 1,
        backgroundImage: `url(${destroyerImage})`,
        backgroundSize: '100% 60%',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
    }

    const manipulateShipPanel = {
        width: 2 * delta,
        height: 3 * delta,
        border: '1px solid black',
        marginLeft: delta *3 
    }
    const manipulateTitle = {
        height: '15%',
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    }
    const arrowUpContainer = {
        height: '20%',
        width: '100%',

        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    }
    const arrowLeftContainer = {
        height: '100%',
        width: '50%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    }

    const arrowRightContainer = {
        height: '100%',
        width: '50%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    }
    const leftAndRightContainer ={
        display: 'flex',
        width: '100%'
    }
    const arrowDownContainer = {
        height: '20%',
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    }
    const rotateLeftAndRightContainer = {
        height: '25%',
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    }
    const rotateLeftContainer = {
        height: '100%',
        width: '50%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    }
    const rotateRightContainer = {
        height: '100%',
        width: '50%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    }

    const arrowStyles = {
        cursor: 'pointer'
    }
    const buttonPanelContainer = {
        display: 'flex',
        cursor:'pointer'
    }
    const hitStyles={
        background: 'rgba(255, 34, 34, 0.5)'
    }
    const missedStyles= {
        background: 'rgba(34, 41, 255, 0.5)'
    }

    function handleBattleshipDragStart(e: MouseEvent) {
        setGameState({...gameState, placingBattleShip:true, placingCarrier:false});
    }
    function handleDestroyerDragStart () {
        setGameState({...gameState, placingDestroyer:true, placingBattleShip:false, placingCarrier:false});
    }
    function handleCarrierDragStart (){
        setGameState({...gameState, placingCarrier:true, placingBattleShip:false});
    }
    function handleGridCarrierClick () {
        setGameState({...gameState, placingBattleShip:false, placingCarrier:true, placingDestroyer:false});
    }
    function handleGridBattleShipClick () {
        setGameState({...gameState, placingBattleShip:true, placingCarrier:false, placingDestroyer:false});
    }
    function handleGridDestroyerClick () {
        setGameState({...gameState, placingDestroyer:true, placingCarrier:false, placingBattleShip:false});   
    }

    function handleShipDragEnd(e: MouseEvent, ship:string) {
        // console.log(gameState.placingBattleShip);
        // setGameState({...gameState, placingBattleShip:false});
        const halfBattleShipWidth = (window.innerHeight*.75 * (4/8))/2;
        const halfCarrierWidth = (gridEdgeLength * (carrierLength/numGridEdge))/2;
        const halfDestroyerWidth = destroyerLength/2;
        const gridEdge = (window.innerHeight*.75);
        const delta = (window.innerHeight*.75)/8;
        // initialize half ship width & height
        let halfShipWidth=0;
        let halfShipHeight=delta/2;
        switch (ship) {
            case 'battleShip': halfShipWidth = halfBattleShipWidth;
                break;
            case 'carrier' : halfShipWidth = halfCarrierWidth;
                break
            case 'destroyer' : halfShipWidth = halfDestroyerWidth;
                break
        }
    
        if (
            // checks if ship is inside the grid to allow placement
            (e.clientX > ((window.innerWidth - gridEdge)/2 + halfShipWidth) &&
            e.clientY > ((window.innerHeight - gridEdge)/2 + halfShipHeight))
            &&  (e.clientX < ((window.innerWidth - gridEdge)/2+ gridEdge - halfShipWidth/2) &&
            e.clientY < ((window.innerHeight - gridEdge)/2 + gridEdge - halfShipHeight/2))
           ) {
               //converts clientX and clientY to grid coordinates e.g.(2,3)
               const gridX = Math.floor((e.clientX - (window.innerWidth - gridEdge)/2)/delta);
               const gridY = Math.floor((e.clientY - (window.innerHeight- gridEdge)/2)/delta); 
               if(ship == 'battleShip') {
                    const battleShip = [...gameState.battleShip];
                    for(var i=0; i<battleShip.length; i++) {
                        //fill in position coordinates
                        battleShip[i].pos.x = gridX - 2 + i;
                        battleShip[i].pos.y = gridY;
                    }
                    setGameState({...gameState, battleShipsPlaced:true, battleShip:battleShip})
               } else if(ship == 'carrier') {
                    const carrier = [...gameState.carrier];
                    for(var i=0; i<carrier.length; i++) {
                        carrier[i].pos.x = gridX - 3+i;
                        carrier[i].pos.y = gridY;
                    }
                    setGameState({...gameState, carrierPlaced:true, carrier:carrier})
                    // console.log(gameState.carrier)
               } else if (ship == 'destroyer') {
                    const destroyer = [...gameState.destroyer];
                    for(var i=0; i<destroyer.length; i++) {
                        destroyer[i].pos.x = gridX - 1+i;
                        destroyer[i].pos.y = gridY;
                    }
                    setGameState({...gameState, destroyerPlaced:true, destroyer:destroyer})
                    console.log(gameState.destroyer);
               }

           }

    }

    function setManipulateTrue() {
        setGameState({...gameState, manipulatingBattleShip: true});
    }

    function checkConflicts(newShip:any, shipType:string) {
        
        let battleDestroyerConflict = false;
        let battleCarrierConflict = false; 
        let destroyerCarrierConflict =false;
        let carrier = gameState.carrier;
        let battleShip= gameState.battleShip;
        let destroyer = gameState.destroyer;
        if(shipType=='carrier') {
            carrier=newShip;
        } else if (shipType=='destroyer'){
            destroyer=newShip
        } else {battleShip=newShip}

        let carrierStringArray=[];
        let destroyerStringArray=[];
        let battleShipStringArray=[];
        for(let i=0;i<carrier.length;i++){carrierStringArray.push(JSON.stringify(carrier[i].pos))}
        for(let i=0;i<destroyer.length;i++){destroyerStringArray.push(JSON.stringify(destroyer[i].pos))}
        for(let i=0;i<battleShip.length;i++){battleShipStringArray.push(JSON.stringify(battleShip[i].pos))}
       
        for(let i=0;i<carrier.length;i++){
            if(_.includes(destroyerStringArray, carrierStringArray[i]) && 
            gameState.carrierPlaced==true && gameState.destroyerPlaced==true){
                destroyerCarrierConflict =true;
            } else if(_.includes(battleShipStringArray, carrierStringArray[i]) &&
            gameState.carrierPlaced==true && gameState.battleShipsPlaced==true
            ){
                battleCarrierConflict = true;
            }
        }

        for(let i=0;i<battleShip.length;i++){
            if(_.includes(destroyerStringArray, battleShipStringArray[i]) &&
            gameState.battleShipsPlaced==true && gameState.destroyerPlaced==true
            ) {
                battleDestroyerConflict = true;
            }
        }

        console.log(destroyerStringArray)
        for(var i=0 ; i<carrier.length;i++){
    

            console.log('conflicts',battleDestroyerConflict,battleCarrierConflict,destroyerCarrierConflict)
            if(battleDestroyerConflict==true||battleCarrierConflict==true
                ||destroyerCarrierConflict==true ) {
                    return true
                }
            return false;
        }
    }

    function moveShipUp() {
        if(gameState.placingBattleShip){
            const battleShip = _.cloneDeep(gameState.battleShip);


            if(battleShip[0].pos.y > 0) {
                for(var i = 0; i <battleShip.length; i++) {
                    battleShip[i].pos.y = battleShip[i].pos.y -1;
                }
                const conflict = checkConflicts(battleShip,'battleship');
                if(conflict !=true) {
                    setGameState({...gameState, battleShip: battleShip});
                }
                
            }
        } else if (gameState.placingCarrier) {
            const carrier = _.cloneDeep(gameState.carrier)
            if(carrier[0].pos.y > 0) {
                for(var i = 0; i <carrier.length; i++) {
                    carrier[i].pos.y = carrier[i].pos.y -1;
                }
                const conflict = checkConflicts(carrier,'carrier');
                if(conflict !=true) {
                    setGameState({...gameState, carrier: carrier});
                }
            }
        } else if (gameState.placingDestroyer) {
            const destroyer = _.cloneDeep(gameState.destroyer)
            if(destroyer[0].pos.y > 0) {
                for(var i = 0; i <destroyer.length; i++) {
                    destroyer[i].pos.y = destroyer[i].pos.y -1;
                }
                const conflict = checkConflicts(destroyer,'destroyer');
                if(conflict!= true) {
                    setGameState({...gameState, destroyer: destroyer});
                }
            }
        }
    }

    function moveShipLeft() {
        if(gameState.placingBattleShip) {
            const battleShip = _.cloneDeep(gameState.battleShip)
            if(battleShip[0].pos.x > 0) {
                for(var i = 0; i <battleShip.length; i++) {
                    battleShip[i].pos.x = battleShip[i].pos.x -1;
                }
                const conflict = checkConflicts(battleShip,'battleShip');
                if(conflict!= true) {
                   setGameState({...gameState, battleShip: battleShip});
                }
            }
        } else if(gameState.placingCarrier) {
            const carrier = _.cloneDeep(gameState.carrier)
            if(carrier[0].pos.x > 0) {
                for(var i = 0; i <carrier.length; i++) {
                    carrier[i].pos.x = carrier[i].pos.x -1;
                }
                const conflict = checkConflicts(carrier,'carrier');
                if(conflict!= true) {
                    setGameState({...gameState, carrier: carrier});
                }
            }
        } else if(gameState.placingDestroyer) {
            const destroyer = _.cloneDeep(gameState.destroyer)
            if(destroyer[0].pos.x > 0) {
                for(var i = 0; i <destroyer.length; i++) {
                    destroyer[i].pos.x = destroyer[i].pos.x -1;
                }
                const conflict = checkConflicts(destroyer,'destroyer');
                if(conflict!= true) {
                    setGameState({...gameState, destroyer: destroyer});
                }
            }
        }
    }

    function moveShipRight() {
        if(gameState.placingBattleShip) {
            const battleShip = _.cloneDeep(gameState.battleShip)
            if(battleShip[battleShip.length-1].pos.x < 7) {
                for(var i = 0; i <battleShip.length; i++) {
                    battleShip[i].pos.x = battleShip[i].pos.x +1;
                }
                const conflict = checkConflicts(battleShip,'battleShip');
                if(conflict!= true) {
                    setGameState({...gameState, battleShip: battleShip});
                }
            }
        } else if(gameState.placingCarrier) {
            const carrier = _.cloneDeep(gameState.carrier)
            if(carrier[carrier.length-1].pos.x < 7) {
                for(var i = 0; i <carrier.length; i++) {
                    carrier[i].pos.x = carrier[i].pos.x +1;
                }
                const conflict = checkConflicts(carrier,'carrier');
                if(conflict!= true) {
                    setGameState({...gameState, carrier: carrier});
                }
            }
        } else if(gameState.placingDestroyer) {

            const destroyer = _.cloneDeep(gameState.destroyer)
            if(destroyer[destroyer.length-1].pos.x < numGridEdge-1) {
                for(var i = 0; i <destroyer.length; i++) {
                    destroyer[i].pos.x = destroyer[i].pos.x +1;
                }
                const conflict = checkConflicts(destroyer,'destroyer');
                if(conflict != true) {
                    setGameState({...gameState, destroyer: destroyer});
                }
            }
        } 
    }

    function moveShipDown() {
        if(gameState.placingBattleShip) {
            const battleShip = _.cloneDeep(gameState.battleShip)
            if(battleShip[battleShip.length-1].pos.y < 7) {
                for(var i = 0; i <battleShip.length; i++) {
                    battleShip[i].pos.y = battleShip[i].pos.y + 1;
                }
                const conflict = checkConflicts(battleShip,'battleShip');
                if(conflict != true) {
                    setGameState({...gameState, battleShip: battleShip});
                }
            }
        } else if(gameState.placingCarrier) {
            const carrier = _.cloneDeep(gameState.carrier)
            if(carrier[carrier.length-1].pos.y < 7) {
                for(var i = 0; i <carrier.length; i++) {
                    carrier[i].pos.y = carrier[i].pos.y + 1;
                }
                const conflict = checkConflicts(carrier,'carrier');
                if(conflict != true) {
                    setGameState({...gameState, carrier: carrier});
                }
            }
        } else if (gameState.placingDestroyer) {
            const destroyer = _.cloneDeep(gameState.destroyer)
            if(destroyer[destroyer.length-1].pos.y < 7) {
                for(var i = 0; i <destroyer.length; i++) {
                    destroyer[i].pos.y = destroyer[i].pos.y + 1;
                }
                const conflict = checkConflicts(destroyer,'destroyer');
                if(conflict != true) {
                    setGameState({...gameState, destroyer: destroyer});
                }
            }
        }

    }
    function rotateShip() {
        if(gameState.placingBattleShip) {
            const battleShip = gameState.battleShip
            const newBattleShip = _.cloneDeep(battleShip);
            if(!gameState.battleShipVertical){
                if(numGridEdge-2 >  battleShip[0].pos.y  && battleShip[0].pos.y > 0 ) {
                    for(var i = 0; i <battleShip.length; i++) {
                        newBattleShip[i].pos.y = battleShip[2].pos.y - 1 +i;
                        newBattleShip[i].pos.x = battleShip[2].pos.x -1;
                    }
                    const conflict = checkConflicts(newBattleShip,'battleShip');
                    if(conflict != true) {
                        setGameState({...gameState, battleShip: newBattleShip, battleShipVertical:true});
                    }
                }
            } 
            else {
                if(battleShip[0].pos.x >0 && battleShip[0].pos.x <numGridEdge-2) {
                    for(var i = 0; i <battleShip.length; i++) {
                        newBattleShip[i].pos.y = battleShip[2].pos.y - 1;
                        newBattleShip[i].pos.x = battleShip[2].pos.x - 1 +i;
                    }
                    const conflict = checkConflicts(newBattleShip,'battleShip');
                    if(conflict != true) {
                        setGameState({...gameState, battleShip: newBattleShip, battleShipVertical:false});
                    }
                }
            }
    
        } else if (gameState.placingCarrier) {
            const carrier = gameState.carrier;
            const newCarrier = _.cloneDeep(carrier);
            if(!gameState.carrierVertical){
                if(numGridEdge-2 >  carrier[0].pos.y  && carrier[0].pos.y > 1 ) {
                    for(var i = 0; i <carrier.length; i++) {
                        newCarrier[i].pos.y = carrier[2].pos.y -2 +i;
                        newCarrier[i].pos.x = carrier[2].pos.x ;
                    }
                    const conflict = checkConflicts(newCarrier,'carrier');
                    if(conflict != true) {
                        setGameState({...gameState, carrier: newCarrier, carrierVertical:true});
                    }
                }
            } 
            else {
                if(carrier[0].pos.x >1 && carrier[0].pos.x <numGridEdge-2) {
                    for(var i = 0; i <carrier.length; i++) {
                        newCarrier[i].pos.y = newCarrier[2].pos.y ;
                        newCarrier[i].pos.x = newCarrier[2].pos.x - 2 +i;
                    }
                    const conflict = checkConflicts(newCarrier,'carrier');
                    if(conflict != true) {
                        setGameState({...gameState, carrier: newCarrier, carrierVertical:false});
                    }
                }
            }
        } else if (gameState.placingDestroyer) {
            const destroyer = gameState.destroyer;
            const newDestroyer = _.cloneDeep(destroyer);
            if(!gameState.destroyerVertical){
         
                if(numGridEdge-1 >  destroyer[0].pos.y) {

                    for(var i = 0; i <destroyer.length; i++) {
                        newDestroyer[i].pos.y = destroyer[1].pos.y +i;
                        newDestroyer[i].pos.x = destroyer[0].pos.x ;
                    }

                    const conflict = checkConflicts(newDestroyer,'destroyer');
                    if(conflict != true) {
                        setGameState({...gameState, destroyer: newDestroyer, destroyerVertical:true});
                    }
                }
            } 
            else {
                
                if(destroyer[0].pos.x <numGridEdge-1) {
                    for(var i = 0; i <destroyer.length; i++) {
                        newDestroyer[i].pos.y = newDestroyer[0].pos.y ;
                        newDestroyer[i].pos.x = newDestroyer[0].pos.x +i;
                    }
                    const conflict = checkConflicts(newDestroyer,'destroyer');
                    if(conflict != true) {
                        setGameState({...gameState, destroyer: newDestroyer, destroyerVertical:false});
                    }
                }
            }

        }

    }

    function startGame() {
        setGameState({...gameState, gameStarted:true});
    }

    function fire(row:any, col:any) {
        console.log('fired')

        const newGrid = gameState.grid;
       
        let newObj = {row:row, column:col, firedAt:true, hit: false}

        if(gameState.gameStarted) {
            for(var i=0; i<gameState.battleShip.length; i++) {
                if (gameState.battleShip[i].pos.x == col && gameState.battleShip[i].pos.y==row) {
                    newObj.hit =true;
                }
            }
            for(var i=0; i<gameState.carrier.length; i++) {
                if (gameState.carrier[i].pos.x == col && gameState.carrier[i].pos.y==row) {
                    newObj.hit =true;
                }
            }
            for(var i=0; i<gameState.destroyer.length; i++) {
                if (gameState.destroyer[i].pos.x == col && gameState.destroyer[i].pos.y==row) {
                    newObj.hit =true;
                }
            }
            newGrid[row][col]= newObj;
            console.log(newGrid)
        }
        setGameState({...gameState, grid: newGrid})
    }


    return(
        
        <div onClick={send} style={containerStyles}>
            <JoinGame/>
            <div style={gameGridStyles}>
            
                {gameState.grid.map((row, rowIndex)=>{return(
                   row.map((col, colIndex)=>{return( <div style={gameState.grid[rowIndex][colIndex].firedAt ==true?
                                                                (gameState.grid[rowIndex][colIndex].hit==true?
                                                                     hitStyles : missedStyles):gridElementStyles}
                                                          onClick={()=>fire(rowIndex,colIndex)}
                                                         
                                                     ></div>)}) 
                )})}
                {gameState.battleShipsPlaced? 
                    <div onClick={handleGridBattleShipClick} style={gridBattleShipStyle}> </div> : null}
                {gameState.carrierPlaced?
                     <div onClick={handleGridCarrierClick} style={gridCarrierStyle}> </div> : null}
                {gameState.destroyerPlaced?
                     <div onClick={handleGridDestroyerClick} style={gridDestroyerStyle}> </div> : null}
            </div>
            <div style={buttonPanelContainer}> 
                
                {(gameState.placingBattleShip || gameState.placingCarrier || gameState.placingDestroyer) ?
                    (<div style={manipulateShipPanel}>
                        <div style={manipulateTitle}>Position Ship</div>
                        <div style={arrowUpContainer}>
                            <FontAwesomeIcon  icon={faArrowUp} 
                                            style={arrowStyles}  
                                            onClick={moveShipUp}
                                            />
                        </div>
                        <div style={leftAndRightContainer}>
                            <div style={arrowLeftContainer}>
                                <FontAwesomeIcon style={arrowStyles} 
                                                icon={faArrowLeft} 
                                                onClick={moveShipLeft}
                                                />
                            </div>
                            <div style={arrowRightContainer}>
                                <FontAwesomeIcon icon={faArrowRight}
                                                style={arrowStyles} 
                                                onClick={moveShipRight}
                                                />
                            </div>
                        </div>
                        <div style={arrowDownContainer}>
                            <FontAwesomeIcon icon={faArrowDown} 
                                            style={arrowStyles} 
                                            onClick={moveShipDown}/>
                            </div>
                        <div style={rotateLeftAndRightContainer}>
                            <div style={rotateLeftContainer}>
                                <FontAwesomeIcon icon={faRotateLeft} 
                                                style={arrowStyles} 
                                                onClick={rotateShip}
                                                />
                            </div>
                            <div style={rotateRightContainer}>
                                <FontAwesomeIcon icon={faRotateRight} 
                                                style={arrowStyles} />
                            </div>
                        </div>

                    </div> ): null
                }
                {(gameState.battleShipsPlaced && 
                gameState.carrierPlaced && 
                gameState.destroyerPlaced) ?
                <button onClick={startGame}>Start Game</button>
                :null}
            </div>
            <div style={shipYardStyles}>
                {!gameState.battleShipsPlaced?
                    <div 
                    onDragStart={handleBattleshipDragStart}
                    onDragEnd={(e)=>handleShipDragEnd(e, 'battleShip')} 
                    style={battleshipStyle} 
                    draggable='true'
    
                    ></div> : null
                }

                <div draggable='true' 
                     onDragStart={handleCarrierDragStart}
                     onDragEnd={(e)=>handleShipDragEnd(e, 'carrier')} 
                     style={carrierStyle}></div>
                <div draggable='true' 
                     onDragStart={handleDestroyerDragStart}
                     onDragEnd={(e)=>handleShipDragEnd(e, 'destroyer')} 
                     style={destroyerStyle}></div>
            </div>
            
        </div>
    );
    
}
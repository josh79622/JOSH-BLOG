import { useState, useEffect, useCallback } from 'react'
import style from './style.module.css'
import pokerIcon from './images/pokerIcon.png'
import _ from 'lodash'
import spade from './images/spade.png'
import heart from './images/heart.png'
import diamond from './images/diamond.png'
import club from './images/club.png'

import Image from 'next/image'

// import styled from 'styled-components'

// const Header = styled.div`
//   position: fixed;
// `;
const suitImages = {
  spade,
  heart,
  diamond,
  club,
}

const cardNames = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']
const cardSuits = ['spade', 'heart', 'diamond', 'club']
const initialCards = (() => {
  let allCards = []
  cardNames.forEach(name => {
    cardSuits.forEach(suit => {
      allCards.push({
        id: `${name}_of_${suit}`,
        name,
        suit,
        _class: `card_${suit}`,
        image: suitImages[suit],
        color: suit === 'heart' || suit === 'diamond' ? 'red' : 'black',
        isShown: false,
      })
    })
  })
  return allCards
})()

function Game(props) {
  // let location = useLocation();
  console.log('PROPS', props)
  // console.log('location', location)
  const [allCards, setAllCards] = useState(() => _.shuffle(_.cloneDeep(initialCards)))
  const [tempOpenedCard, setTempOpenedCard] = useState(null)
  const [isBlocked, setIsBlocked] = useState(false)
  const [score, setScore] = useState(0)
  const [countOfFlip, setCountOfFlip] = useState(0)
  const [timer, setTimer] = useState(0)
  // const [interval, setInterVal] = useState(null)

  const restart = () => {
    setTempOpenedCard(null)
    setIsBlocked(false)
    setScore(0)
    setCountOfFlip(0)
    shuffleCards()
  }
  const closeCard = (id) => {
    const Cards = allCards
    const card = Cards.find(card => card.id === id)
    card.isShown = false
    setAllCards(Cards)
  }
  const openCard = (id) => {
    const Cards = allCards
    const card = Cards.find(card => card.id === id) || {}
    card.isShown = true
    setAllCards(Cards)
  }
  const clickCard = (card) => {
    if (isBlocked) {
      return;
    }
    setCountOfFlip(v => (v+1))
    openCard(card.id)
    if (!tempOpenedCard) {
      setTempOpenedCard(card)
    } else {
      if (tempOpenedCard.name === card.name) {
        setScore(v => (v+10))
      } else {
        setIsBlocked(true)
        setTimeout(() => {
          closeCard(card.id)
          closeCard(tempOpenedCard.id)
          setIsBlocked(false)
        }, 1000)
      }
      setTempOpenedCard(null)
    }
  }
  return (
    <div className={style.flipCardMain}>
      <div className={style.header}>
        <div className={style.logo}>
          <div>
            <Image src={pokerIcon} alt="pokerIcon"/>
          </div>
        </div>
        <div className={style.headerInfo}>
          <p className={style.title}>Memory Game</p>
          <br/>
          <p><span>SCORE:</span>{score}</p>
          <p><span>Flip times:</span>{countOfFlip}</p>
          <p><span>Time:</span>{timer}</p>
          <br/>
          <button className={style.button} onClick={restart}>Restart</button>
        </div>
      </div>
      <div className={style.container}>
        {
          [0, 1, 2, 3].map((v, k) => (
            <div className={style.cardRow} key={k}>
              {
                allCards.slice(v * 13, (v + 1) * 13).map((card, k) => (
                  card.isShown ? <div key={k} className={`${style.card} ${style.cardSuit} ${style[card._class]}`}>
                    <div className={`${style.cardName} ${style[card.color]}`}>{card.name}</div>
                    <div className={`${style.cardName} ${style.cardNameUpsideDown} ${style[card.color]}`}>{card.name}</div>
                  </div> : <div className={`${style.card} ${style.covered}`} onClick={clickCard.bind(this, card)}></div>
                ))
              }
            </div>
          ))
        }
        <div></div>
      </div>
    </div>
  )
}

export default Game

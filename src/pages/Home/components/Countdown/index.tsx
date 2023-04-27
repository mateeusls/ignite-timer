import { differenceInSeconds } from 'date-fns'
import { useContext, useEffect } from 'react'
import { CyclesContext } from '../../../../contexts/CyclesContext'
import { CountdownContainer, Separator } from './styles'

export function Countdown() {
  const {
    activeCycle,
    activeCycleId,
    markCurrentCycleAsFinished,
    amountSecondPassed,
    setSecondsPassed,
  } = useContext(CyclesContext)

  const totalSeconds = activeCycle ? activeCycle.minutesAmount * 60 : 0 // Calculando o total de segundos do ciclo ativo

  // Disparando o efeito toda vez que o ciclo ativo mudar de valor (ciclo ativo é o ciclo que está sendo executado)
  useEffect(() => {
    let interval: number
    if (activeCycle) {
      interval = setInterval(() => {
        const secondsDifference = differenceInSeconds(
          new Date(),
          new Date(activeCycle.startDate),
        )

        if (secondsDifference >= totalSeconds) {
          markCurrentCycleAsFinished()

          setSecondsPassed(totalSeconds)
          clearInterval(interval)
        } else {
          setSecondsPassed(secondsDifference)
        }
      }, 1000)
    }

    return () => clearInterval(interval)
  }, [
    activeCycle,
    activeCycleId,
    markCurrentCycleAsFinished,
    setSecondsPassed,
    totalSeconds,
  ])

  const currentSeconds = activeCycle ? totalSeconds - amountSecondPassed : 0 // Calculando o total de segundos do ciclo ativo

  // Calculando a quantidade de minutos do ciclo ativo, arredondando para baixo com Math.floor(Math.ceil para cima)
  const minutesAmount = Math.floor(currentSeconds / 60)
  const secondsAmount = currentSeconds % 60 // Calculando a quantidade de segundos restantes do ciclo ativo

  const minutes = String(minutesAmount).padStart(2, '0') // Formatando a quantidade de minutos para ter 2 dígitos
  const seconds = String(secondsAmount).padStart(2, '0') // Formatando a quantidade de segundos para ter 2 dígitos

  // Quando o activeCycle mudar de valor, o título da página será atualizado
  useEffect(() => {
    if (activeCycle) {
      document.title = `${minutes}:${seconds} - ${activeCycle.task}`
    }
  }, [activeCycle, minutes, seconds])

  return (
    <CountdownContainer>
      <span>{minutes[0]}</span>
      <span>{minutes[1]}</span>
      <Separator>:</Separator>
      <span>{seconds[0]}</span>
      <span>{seconds[1]}</span>
    </CountdownContainer>
  )
}

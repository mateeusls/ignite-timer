import { zodResolver } from '@hookform/resolvers/zod'
import { HandPalm, Play } from '@phosphor-icons/react'
import { useContext } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import * as zod from 'zod'
import { CyclesContext } from '../../contexts/CyclesContext'
import { Countdown } from './components/Countdown'
import { NewCycleForm } from './components/NewCycleForm'
import {
  HomeContainer,
  StartCountdownButton,
  StopCountdownButton,
} from './styles'

// Definindo o schema de validação;
const newCycleFormValidationSchema = zod.object({
  task: zod.string().min(1, 'Informe a tarefa'),
  minutesAmount: zod.number(),
})

/**
 * Inferindo ao invés de tipar manualmente;
 * Usasse o typeof já que o typescript não entende variáveis javascript;
 */
type NewCycleFormData = zod.infer<typeof newCycleFormValidationSchema>

export function Home() {
  const { activeCycle, createNewCycle, interruptCurrentCycle } =
    useContext(CyclesContext)
  /**
   * O hook useForm recebe um objeto de configuração
   * que pode ser usado para definir o resolver de validação
   * que será usado para validar os dados do formulário
   * e também para definir o modo de validação (onChange, onSubmit, onBlur)
   * que será usado para disparar a validação;
   *
   * Register é uma função que deve ser usada para registrar
   * os campos do formulário no hook useForm;
   *
   * handleSubmit é uma função que deve ser usada para
   * disparar a função de submit do formulário;
   *
   * watch é uma função que deve ser usada para observar
   * os valores dos campos do formulário;
   *
   * reset é uma função que deve ser usada para resetar
   * os valores dos campos do formulário;
   *
   * FormState é um objeto que contém informações sobre o estado
   * do formulário, como se os campos estão válidos ou não;
   */
  const newCycleForm = useForm<NewCycleFormData>({
    resolver: zodResolver(newCycleFormValidationSchema),
  })

  const { handleSubmit, watch, reset } = newCycleForm

  function handleCreateNewCycle(data: NewCycleFormData) {
    createNewCycle(data)
    reset()
  }

  const task = watch('task') // Observando o valor do campo task
  const isSubmitDisabled = !task // Desabilitando o botão de submit caso o campo task esteja vazio

  return (
    <HomeContainer>
      <form action="" onSubmit={handleSubmit(handleCreateNewCycle)}>
        <FormProvider {...newCycleForm}>
          <NewCycleForm />
        </FormProvider>
        <Countdown />

        {activeCycle ? (
          <StopCountdownButton onClick={interruptCurrentCycle} type="button">
            <HandPalm size={24} />
            Interromper
          </StopCountdownButton>
        ) : (
          <StartCountdownButton disabled={isSubmitDisabled} type="submit">
            <Play size={24} />
            Começar
          </StartCountdownButton>
        )}
      </form>
    </HomeContainer>
  )
}

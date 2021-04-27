import React, { Component } from 'react';
import './Calculator.css';

import Button from '../components/Button';
import Display from '../components/Display';
import { waitForElementToBeRemoved } from '@testing-library/dom';

const initialState = {
  displayValue: '0',
  clearDisplay: false,
  operation: null,
  values: [0, 0],
  current: 0
}

export default class Calculator extends Component {
  //Estado inicial do objeto
  state = { ...initialState }

  constructor(props) {
    super(props)
    this.clearMemory = this.clearMemory.bind(this)
    this.setOperation = this.setOperation.bind(this)
    this.addDigit = this.addDigit.bind(this)
  }

  clearMemory() {
    this.setState({ ...initialState })
  }

  /* Lógica de operações:
    Primeiro valor vai pra primeira posição do Array, depois clique na operação 
    e o segundo valor vai pra segunda posição do array.
    Na próxima vez que clicar em outra operação ou no igual significa que ele vai
    pegar esses dois valores, processar e gerar o resultado e armazenar o resultado
    no primeiro elemento do array, ou seja no elemento de índice 0, limpo o elemento
    de índice 1 e ele fica pronto para executar outra operação */
  setOperation(operation) {
    if (this.state.current === 0) {
      this.setState({ operation, current: 1, clearDisplay: true })
    } else {
      const equals = operation === '='
      const currentOperation = this.state.operation

      const values = [...this.state.values]
      try {
        values[0] = eval(`${values[0]} ${currentOperation} ${values[1]}`)
      } catch (e) {
        values[0] = this.state.values[0]
      }

      values[1] = 0

      this.setState({
        displayValue: values[0],
        operation: equals ? null : operation,
        current: equals ? 0 : 1,
        clearDisplay: !equals,
        values
      })
    }
  }

  addDigit(n) {
    //Tratamento para adicionar somente um . no display
    if (n === '.' && this.state.displayValue.includes('.')) {
      return
    }

    // Tratamento para evitar o zero à esquerda
    const clearDisplay = this.state.displayValue === '0'
      || this.state.clearDisplay

    const currentValue = clearDisplay ? '' : this.state.displayValue
    const displayValue = currentValue + n
    this.setState({ displayValue, clearDisplay: false })

    // Sempre que digitado um valor diferente de um  ponto
    if (n !== '.') {
      const i = this.state.current // Pego o indice do valor que estou alterando
      const newValue = parseFloat(displayValue) // Converto para float
      const values = [...this.state.values] // Clone a partir do spread dentro de um novo array
      values[i] = newValue // Altero o valor atual que pode ser indice 0 ou 1
      this.setState({ values }) // Substituo o novo array dentro de state
      console.log(values)
    }
  }

  render() {
    return (
      <div className="calculator">
        <Display value={this.state.displayValue} />
        <Button label="AC" click={this.clearMemory} triple />
        <Button label="/" click={this.setOperation} operation />
        <Button label="7" click={this.addDigit} />
        <Button label="8" click={this.addDigit} />
        <Button label="9" click={this.addDigit} />
        <Button label="*" click={this.setOperation} operation />
        <Button label="4" click={this.addDigit} />
        <Button label="5" click={this.addDigit} />
        <Button label="6" click={this.addDigit} />
        <Button label="-" click={this.setOperation} operation />
        <Button label="1" click={this.addDigit} />
        <Button label="2" click={this.addDigit} />
        <Button label="3" click={this.addDigit} />
        <Button label="+" click={this.setOperation} operation />
        <Button label="0" click={this.addDigit} double />
        <Button label="." click={this.addDigit} />
        <Button label="=" click={this.setOperation} operation />
      </div>
    )
  }
}
import { Neuron } from 'lib/neuron';
import { Layer } from 'lib/layer';

export class Network {
  private layers: Layer[];
  private firstLayer: Layer;
  private lastLayer: Layer;
  private targets: number[];
  private inputs: number[];
  private totalLoss: number;
  private totalLossPrime: number;
  private output: number[];
  private learningRate: number;

  constructor (targets: number[], inputs: number[]) {
    if (targets.length !== inputs.length) {
      throw new Error('targets must have same length with inputs');
    }
    this.targets = targets;
    this.inputs = inputs;

    this.layers = [];
    this.totalLoss = -1;
    this.totalLossPrime = -1;
    this.output = [];
  }

  setLearningRate (learningRate: number) {
    this.learningRate = learningRate;
  }

  createNodes (layerCount: number, nodePerLayer: number) {
    for (let i = 0; i < layerCount; i++) {
      const layer: Layer = new Layer(`layer-${i}`);
      for (let j = 0; j < nodePerLayer; j++) {
        const neuron = new Neuron(`neuron-[${i}][${j}]`, [Math.random(), Math.random()]);
        layer.pushNeuron(neuron);
      }

      if (i === 0) {
        this.firstLayer = layer;
        this.firstLayer.setInputs(this.inputs);
      } else if (i === layerCount - 1) {
        this.lastLayer = layer;
      }

      this.layers.push(layer);
    }

    this.layers.forEach((layer, layerIndex) => {
      const prevLayer = this.layers[layerIndex - 1];
      const nextLayer = this.layers[layerIndex + 1];
      if (prevLayer) {
        layer.setPrevLayer(prevLayer);
      }
      if (nextLayer) {
        layer.setNextLayer(nextLayer);
      }
    });
  }

  forwardPropagation () {
    this.layers.forEach(layer => {
      layer.calc();
    });
    const loss = this.lastLayer.getForwardLoss(this.targets);
    this.output = this.lastLayer.getResults();
    this.totalLoss = loss.forward;
    this.totalLossPrime = loss.prime;
  }

  backPropagation () {
    const reversed = [...this.layers].reverse();
    reversed.forEach((layer, index) => {
      if (layer.id === this.lastLayer.id) {
        layer.updateWeights(this.totalLossPrime, this.learningRate);
      } else {
        const loss = layer.nextLayer.getBackwardLoss();
        console.log('error -> ', this.totalLoss);
        layer.updateWeights(loss, this.learningRate);
      }
    });
  }

  getResults () {
    return this.lastLayer.getResults();
  }
}

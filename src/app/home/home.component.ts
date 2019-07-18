import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as jspdf from 'jspdf';
import html2canvas from 'html2canvas';
import { DeviceDetectorService } from 'ngx-device-detector';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  deviceInfo = null;
  messageForm: FormGroup;
  submitted = false;
  sucess = false;
  name: string;
  qtdItem: number;
  color: string;
  colorText: string;
  inicio: number;
  fim: number;
  flagMaiorTrinta: boolean;
  cranberry: boolean;
  messageDevice: boolean;

  constructor(private formBuilder: FormBuilder, private deviceService: DeviceDetectorService) {
    this.messageForm = this.formBuilder.group({
      name: ['Água', Validators.required],
      qtd: ['30', Validators.compose(
        [Validators.required, Validators.min(30), Validators.pattern(/^-?(0|[1-9]\d*)?$/)]
      )],
      cor: ['#c7e8f9', Validators.required],
      corFont: ['#0d38dc', Validators.required],
      qtdInicio: ['1', Validators.compose(
        [Validators.required, Validators.min(1), Validators.pattern(/^-?(0|[1-9]\d*)?$/)]
      )],
      qtdFim: ['30', Validators.compose(
        [Validators.required, Validators.min(30), Validators.pattern(/^-?(0|[1-9]\d*)?$/)]
      )],
      logoCranberry: [false]
    });
  }

  onSubmite() {
    this.flagMaiorTrinta = false;
    this.submitted = true;
    if (this.messageForm.invalid) {
      return;
    }

    this.fim = this.messageForm.controls.qtdFim.value;
    this.inicio = parseInt(this.messageForm.controls.qtdInicio.value);
    this.name = this.messageForm.controls.name.value;
    this.qtdItem = Math.abs(this.fim - this.inicio);
    this.color = this.messageForm.controls.cor.value;
    this.colorText = this.messageForm.controls.corFont.value;
    this.cranberry = this.messageForm.controls.logoCranberry.value;
    if (this.qtdItem < 29) {
      this.flagMaiorTrinta = true;
      return;
    }
    this.sucess = true;
  }
  print() {
    window.scroll(0, 0);
    const printDiv = document.getElementById('printDiv');
    const largura = printDiv.clientWidth + (printDiv.clientWidth * .10);
    const altura = printDiv.clientHeight + (printDiv.clientHeight * .10);
    // utiliza a biblioteca JSPDF.js para gerar o pdf da tela
    html2canvas(printDiv).then(canvas => {
      const pdf = new jspdf('p', 'pt', [largura * .65, altura * .65]);
      for (let i = 0; i <= printDiv.clientHeight / altura; i++) {
        const srcImg = canvas;
        const sX = 0;
        const sY = (altura * .65) * i; // start 980 pixels down for every new page
        const sWidth = largura * 1.8;
        const sHeight = altura * 1.8;
        const dX = 0;
        const dY = 0;
        const dWidth = largura;
        const dHeight = altura;
        let onePageCanvas = document.createElement('canvas');
        onePageCanvas.setAttribute('width', (largura * .75).toString());
        onePageCanvas.setAttribute('height', altura.toString());
        document.body.appendChild(onePageCanvas);
        const ctx = onePageCanvas.getContext('2d');
        ctx.drawImage(srcImg, sX, sY, sWidth, sHeight, dX, dY, dWidth, dHeight);
        let canvasDataURL = onePageCanvas.toDataURL("image/png", 1.0);
        let width = onePageCanvas.clientWidth;
        let height = onePageCanvas.clientHeight;
        if (i > 1) {
          pdf.addPage('a4');
        }

        pdf.setPage(i + 1);
        pdf.addImage(canvasDataURL, 'PNG', 20, 20, (width * 1.2), (height * 1.2));
        document.body.removeChild(onePageCanvas);
      }
      pdf.save('ticket-' + this.name + ' - de ' + this.inicio + ' até ' + this.fim);

    });
  }
  ngOnInit() {
    this.name = '';
    this.qtdItem = 0;
    this.color = '';
    this.colorText = '';
    this.flagMaiorTrinta = false;
    this.cranberry = false;
    this.deviceInfo = this.deviceService.isDesktop();
  }

}

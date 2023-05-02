import { Component } from '@angular/core';
import { Router } from '@angular/router';
import * as  consultarCNPJ from 'consultar-cnpj';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Consulta CNPJs';
  empresa: any;
  retornos: any[] = [];
  intCNPJ: any;

  // Criar service que importa e converte XLSX em Json (para Firebase)
  // Estes dados virão do Firebase a partir de uma planilha Excel usando XLSX Library
  cnpjs = ['33509533000152', '27865757000102', '14158418000136', '10894114000186', '02828446000134', '72610132000146', '01874354000128', '04220692000134', '26159125000152'];

  constructor(public router: Router) {
    this.oneMinuteInterval();
  }

  // Função que atualiza as consultas a cada 1 minuto (requisito da API https://www.cnpj.ws/docs/api-publica/consultando-cnpj)
  oneMinuteInterval() { 
    this.getCNPJ();
    this.intCNPJ = setInterval(() => {
      if (this.cnpjs.length > 0) {
        this.getCNPJ();
      } else {
        console.log('Acabou!');
        clearInterval(this.intCNPJ);
      }
    }, 60 * 1024);
  }

  // Função de consulta dos 3 primeiros CNPJs do get no Firebase
  // Insere cada resultado no array 'retornos'
  // Ao finalizar as consultas, remove as 3 primeiras posições do array
  async getCNPJ() { 
    // this.retornos = [];
    for (let i = 0; i < 3; i++) {
      this.empresa = await consultarCNPJ(this.cnpjs[i]);
      this.retornos.push(this.empresa);
      console.log(this.cnpjs);
    }
    this.cnpjs.splice(0, 3);
    console.log(this.cnpjs);
    console.log(this.retornos);
  }
  // array 'retornos' alimenta coleção 'empresas' no Firebase
  // Criar service para consultar esta coleção e converter Json em XLSX, e liberar download:
  // CNPJ, razao_social, situacao_cadastral, data_situacao_cadastral, atividade_principal ( somente a descrição), 
  // atividades_secundarias ( somente a descrição), ddd1, telefone1, ddd2, telefone2, email
}

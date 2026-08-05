import { Component, OnInit, OnDestroy } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { Motion } from '@capacitor/motion';

@Component({
  selector: 'app-bob',
  templateUrl: './bob.page.html',
  styleUrls: ['./bob.page.scss'],
  standalone: false
})
export class BobPage implements OnInit, OnDestroy {
  preguntaUsuario: string = '';
  respuesta: string = 'Tira de la cuerda mágica...';
  animando: boolean = false;
  modoEnojada: boolean = false;
  escuchando: boolean = false;
  
  historial: string[] = [];
  listenerId: any;
  logroDesbloqueado: boolean = false; 

  tiempoUltimoToque: number = 0;
  contadorToques: number = 0;

  // --- SISTEMA DE PERSONALIDADES ---
  personalidadActual: number = 0; // 0: Clásica, 1: Sarcástica
  nombresPersonalidad: string[] = ['Clásica', 'Sarcástica'];

  respuestasClasicas: string[] = ['No.', 'Prueba preguntando de nuevo.', 'Ninguno.', 'Nada.', 'Tal vez algún día.', 'Sí.'];
  respuestasSarcasticas: string[] = ['Obvio no.', 'Sigue soñando.', 'Ni en un millón de años.', 'Sí, claro, y yo tengo piernas.', 'Ay, por favor.'];

  // --- ANALÍTICAS MÍSTICAS ---
  mostrarAnaliticas: boolean = false;
  estadisticas = { si: 0, no: 0, neutro: 0, total: 0 };
  timerPresion: any;

  sonidoBurbujas = new Audio('https://www.myinstants.com/media/sounds/spongebob-bubbles.mp3');

  constructor(private toastController: ToastController) {}

  async ngOnInit() {
    this.sonidoBurbujas.volume = 0.15;
    this.sonidoBurbujas.load(); 

    const historialGuardado = localStorage.getItem('historialCaracola');
    if (historialGuardado) this.historial = JSON.parse(historialGuardado);

    const statsGuardadas = localStorage.getItem('statsCaracola');
    if (statsGuardadas) this.estadisticas = JSON.parse(statsGuardadas);

    this.listenerId = await Motion.addListener('accel', (event) => {
      if (!this.animando && (Math.abs(event.acceleration.x) > 15 || Math.abs(event.acceleration.y) > 15)) {
        this.procesarToque();
      }
    });
  }

  ngOnDestroy() {
    if (this.listenerId) Motion.removeAllListeners();
  }

  // --- 1. CONTROL POR VOZ ---
  iniciarDictado() {
    if (!('webkitSpeechRecognition' in window)) {
      this.mostrarToast('Tu navegador no soporta dictado por voz', 'danger', 'mic-off');
      return;
    }
    const reconocimiento = new (window as any).webkitSpeechRecognition();
    reconocimiento.lang = 'es-MX';
    reconocimiento.interimResults = false;
    reconocimiento.maxAlternatives = 1;

    reconocimiento.onstart = () => this.escuchando = true;
    reconocimiento.onend = () => this.escuchando = false;
    reconocimiento.onerror = () => this.escuchando = false;
    
    reconocimiento.onresult = (event: any) => {
      this.preguntaUsuario = event.results[0][0].transcript;
      this.escuchando = false;
    };

    reconocimiento.start();
  }

  // --- 2. PERSONALIDADES INTERCAMBIABLES ---
  cambiarPersonalidad() {
    this.personalidadActual = (this.personalidadActual + 1) % 2; // Solo alterna entre 0 y 1
    this.mostrarToast(`Modo activado: Caracola ${this.nombresPersonalidad[this.personalidadActual]}`, 'tertiary', 'sync-outline');
  }

  async procesarToque() {
    const ahora = Date.now();
    if (ahora - this.tiempoUltimoToque < 400) {
      this.contadorToques++;
    } else {
      this.contadorToques = 1; 
    }
    this.tiempoUltimoToque = ahora;

    if (this.contadorToques >= 10) {
      this.contadorToques = 0; 
      this.activarModoEnojada();
      return;
    }

    if (!this.animando) this.preguntarCaracolaNormal();
  }

  async activarModoEnojada() {
    this.animando = true;
    this.modoEnojada = true;
    this.respuesta = '¡YA DEJA DE PREGUNTAR!';
    
    await Haptics.impact({ style: ImpactStyle.Heavy });
    this.hablar(this.respuesta, true); 

    if (!this.logroDesbloqueado) {
      this.logroDesbloqueado = true;
      this.mostrarToast('🏆 Logro desbloqueado: Paciencia Agotada', 'warning', 'trophy');
    }
    
    setTimeout(() => {
      this.modoEnojada = false;
      this.animando = false;
      this.respuesta = 'Tira de la cuerda mágica...';
    }, 4000);
  }

  async preguntarCaracolaNormal() {
    this.animando = true;
    this.respuesta = 'Consultando...';
    this.sonidoBurbujas.currentTime = 0; 
    this.sonidoBurbujas.play();

    await Haptics.impact({ style: ImpactStyle.Heavy });

    const intervaloVibracion = setInterval(async () => {
      await Haptics.impact({ style: ImpactStyle.Light });
    }, 150);

    setTimeout(async () => {
      clearInterval(intervaloVibracion); 
      
      // Seleccionar el banco de respuestas actual
      let bancoRespuestas = this.respuestasClasicas;
      if (this.personalidadActual === 1) bancoRespuestas = this.respuestasSarcasticas;

      const indice = Math.floor(Math.random() * bancoRespuestas.length);
      this.respuesta = bancoRespuestas[indice];
      
      this.actualizarEstadisticas(this.respuesta);
      this.ejecutarHapticaInteligente(this.respuesta);

      this.historial.unshift(this.respuesta);
      localStorage.setItem('historialCaracola', JSON.stringify(this.historial));

      this.hablar(this.respuesta, false);
      this.animando = false;
      this.preguntaUsuario = ''; // Limpiar el input
    }, 1500); 
  }

  // --- 3. COMUNICACIÓN HÁPTICA AVANZADA ---
  async ejecutarHapticaInteligente(resp: string) {
    const r = resp.toLowerCase();
    const esPositiva = r.includes('sí') || r.includes('claro');
    const esNegativa = r.includes('no') || r.includes('nada') || r.includes('ninguno') || r.includes('jamás');

    if (esPositiva) {
      await Haptics.impact({ style: ImpactStyle.Light });
      setTimeout(async () => await Haptics.impact({ style: ImpactStyle.Light }), 150); // Doble vibración feliz
    } else if (esNegativa) {
      await Haptics.impact({ style: ImpactStyle.Heavy }); // Vibración dura
    } else {
      await Haptics.impact({ style: ImpactStyle.Medium }); // Vibración neutra
    }
  }

  // --- 4. PANEL DE ANALÍTICAS (GESTOS DE PRESIÓN Larga) ---
  iniciarPresion() {
    this.timerPresion = setTimeout(() => {
      this.mostrarAnaliticas = true;
      Haptics.impact({ style: ImpactStyle.Heavy });
    }, 1500); // 1.5 segundos de presión para abrir
  }

  terminarPresion() {
    clearTimeout(this.timerPresion);
  }

  actualizarEstadisticas(resp: string) {
    this.estadisticas.total++;
    const r = resp.toLowerCase();
    
    if (r.includes('sí') || r.includes('claro')) {
      this.estadisticas.si++;
    } else if (r.includes('no') || r.includes('nada') || r.includes('ninguno')) {
      this.estadisticas.no++;
    } else {
      this.estadisticas.neutro++;
    }
    
    localStorage.setItem('statsCaracola', JSON.stringify(this.estadisticas));
  }

  borrarHistorial() {
    this.historial = [];
    localStorage.removeItem('historialCaracola');
  }

  hablar(texto: string, enojada: boolean) {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(texto);
      utterance.lang = 'es-MX'; 
      utterance.rate = enojada ? 1.2 : 0.7; 
      utterance.pitch = enojada ? 1.5 : 0.3; 
      window.speechSynthesis.speak(utterance);
    }
  }

  async mostrarToast(mensaje: string, color: string, icono: string) {
    const toast = await this.toastController.create({
      message: mensaje, duration: 2500, position: 'top', color: color, icon: icono
    });
    await toast.present();
  }
}
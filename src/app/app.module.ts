import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { HttpClientModule } from '@angular/common/http';

// 1. La importación sigue igual
import { GridPracticeComponent } from './grid-practice/grid-practice.component';

@NgModule({
  declarations: [
    AppComponent // ¡Se queda solito aquí!
  ],
  imports: [
    BrowserModule, 
    IonicModule.forRoot(), 
    AppRoutingModule,
    HttpClientModule,
    
    // 2. ¡AQUÍ ESTÁ EL TRUCO! Lo metemos en imports porque es Standalone
    GridPracticeComponent 
  ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}
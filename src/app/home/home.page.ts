import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false 
})
export class HomePage implements OnInit {
  pokemonList: any[] = [];
  filteredPokemon: any[] = [];
  selectedPokemon: any = null;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.cargarPokemones();
  }

  // Traemos los primeros 151 Pokémon
  cargarPokemones() {
    this.http.get('https://pokeapi.co/api/v2/pokemon?limit=151').subscribe((res: any) => {
      this.pokemonList = res.results.map((poke: any, index: number) => {
        return {
          id: index + 1,
          name: poke.name,
          image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${index + 1}.png`
        };
      });
      this.filteredPokemon = this.pokemonList; // Inicializamos la lista filtrada
    });
  }

  // Lógica del buscador
  buscarPokemon(event: any) {
    const texto = event.target.value.toLowerCase();
    if (texto && texto.trim() !== '') {
      this.filteredPokemon = this.pokemonList.filter((poke) => {
        return poke.name.toLowerCase().indexOf(texto) > -1;
      });
    } else {
      this.filteredPokemon = this.pokemonList;
    }
  }

  // Traer detalles cuando le das clic a una tarjeta
  verDetalles(id: number) {
    this.http.get(`https://pokeapi.co/api/v2/pokemon/${id}`).subscribe((res: any) => {
      this.selectedPokemon = res;
    });
  }

  // Volver a la lista
  cerrarDetalles() {
    this.selectedPokemon = null;
  }
}
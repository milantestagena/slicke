import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { signal } from '@angular/core';

@Component({
  selector: 'collection-exchange',
  standalone: true,
  imports: [CommonModule, ],
  templateUrl: './collection-exchange.component.html',
  styleUrls: ['./collection-exchange.component.scss']
})
export class CollectionExchangeComponent implements OnInit {
  @Input() userCollectionId!: string;

  private http = inject(HttpClient);
  exchangeData = signal<any>(null);
  loading = signal(false);

  ngOnInit() {
    this.fetchData();
  }

  fetchData() {
    this.loading.set(true);
    this.http
      .get(`/api/matches/${this.userCollectionId}`)
      .subscribe((res: any) => {
        this.exchangeData.set(res.data?.[0]);
        this.loading.set(false);
      });
  }
}

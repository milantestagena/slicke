import {
  Component,
  Input,
  inject,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  FormArray,
} from '@angular/forms';
import { AppStore } from '../../../store/app.store';
import { Collection, CollectionItem, Country } from '../../../models';
import { CollectionService } from '../../../services/collection.service';
import { StoreService } from '../../../services/store.service';

type Mode = 'create' | 'edit';

@Component({
  selector: 'app-admin-collection-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './collection-form-component.component.html',
  styleUrls: ['./collection-form-component.component.scss'],
})
export class CollectionFormComponentComponent implements OnInit {
  store: any;
  countries!: Country[];
  collectionService: CollectionService;
  storeService: StoreService;
  constructor() {
    this.store = inject(AppStore);
    this.storeService = inject(StoreService);
    this.collectionService = inject(CollectionService);
  }
  @Input() mode: Mode = 'edit';
  @Input() collection?: Collection;

  private fb = inject(FormBuilder);

  form = this.fb.group({
    name: [''],
    type: [''],
    year: [new Date().getFullYear()],
    description: [''],
    link: [''],
    countries: this.fb.group({}),
    itemsCount: [0],
    items: this.fb.array([]),
  });

  get items(): FormArray {
    return this.form.get('items') as FormArray;
  }

  ngOnInit(): void {
    this.initCountriesCheck();

    if (this.collection) {
      this.patchFormFromCollection(this.collection);
    }

    this.form.get('itemsCount')?.valueChanges.subscribe((count) => {
      this.adjustItems(count || 0);
    });
  }

  private initCountriesCheck() {
    this.countries = this.store.getCountries();
    console.log('Available countries:', this.countries);
    const group: { [key: string]: any } = {};
    this.countries.forEach((country) => {
      group[country.id] = [false];
    });
    this.form.setControl('countries', this.fb.group(group));
  }

  private adjustItems(count: number) {
    const items = this.form.get('items') as FormArray;
    while (items.length < count) {
      items.push(
        this.fb.group({
          title: [''],
          description: [''],
          link: [''],
          identifier: [''],
        })
      );
    }
    while (items.length > count) {
      items.removeAt(items.length - 1);
    }
  }

  save() {
    const raw = this.form.getRawValue();
    console.log('Form raw value:', raw);
    const selectedCountries = Object.entries(raw.countries)
      .filter(([_, checked]) => checked)
      .map(([id]) => parseInt(id, 10)) as unknown as Country[];

    const result: Collection = {
      name: raw.name as string,
      type: raw.type as string,
      year: raw.year as number,
      description: raw.description as string,
      link: raw.link as string,
      countries: selectedCountries as Country[],
      items: raw.items as CollectionItem[],
    };
    if(this.mode === 'edit') {
      result.id = this.collection?.id;
    }


    this.storeService.saveCollection(result);
  }

  patchFormFromCollection(collection: Collection) {
    this.form.patchValue({
      name: collection.name,
      type: collection.type,
      year: collection.year,
      description: collection.description,
      link: collection.link,
      itemsCount: collection.items.length,
    });

    this.adjustItems(collection.items.length);

    const itemsArray = this.form.get('items') as FormArray;
    collection.items.forEach((item, index) => {
      itemsArray.at(index).patchValue({
        title: item.title,
        description: item.description,
        link: item.link,
        identifier: item.identifier,
      });
    });

    const countriesGroup = this.form.get('countries') as FormGroup;
    for (const countryId in countriesGroup.controls) {
      countriesGroup
        .get(countryId)
        ?.setValue(collection.countries.some((c) => c.id === +countryId));
    }
  }
}

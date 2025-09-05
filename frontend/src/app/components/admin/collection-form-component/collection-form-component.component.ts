import {
  Component,
  Input,
  inject,
  OnInit,
  computed,
  effect,
  signal,
  runInInjectionContext,
  EnvironmentInjector,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  FormArray,
} from '@angular/forms';
import { CountryFeature } from '../../../store/features/countries.feature';
import { toSignal } from '@angular/core/rxjs-interop';
import { CountryService } from '../../../services/country.service';
import { AppStore } from '../../../store/app.store';
import { Collection, Country } from '../../../models';

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
  constructor() {
    this.store = inject(AppStore);
  }
  @Input() collection?: Collection;

  private fb = inject(FormBuilder);

  form = this.fb.group({
    name: [''],
    type: [''],
    year: [new Date().getFullYear()],
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
    const selectedCountries = Object.entries(raw.countries)
      .filter(([_, checked]) => checked)
      .map(([id]) => parseInt(id, 10));

    const result = {
      name: raw.name,
      type: raw.type,
      year: raw.year,
      countries: selectedCountries,
      items: raw.items,
    };

    console.log('Final payload:', result);
    // kasnije: this.storeService.saveCollection(result)
  }

  patchFormFromCollection(collection: Collection) {
    this.form.patchValue({
      name: collection.name,
      type: collection.type,
      year: collection.year,
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

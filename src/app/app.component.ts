import { Component } from '@angular/core';

import { baseData, BaseData } from './baseData';

@Component({
  selector: 'app-root',
  imports: [],
  styleUrl: './app.component.css',
  template: `
    <hgroup>
      <h1>Base-ically Counting</h1>
      <p>A number system explorer</p>
    </hgroup>

    <hr />

    <main>
      <p>Enter a value to see its representation in other base systems</p>

      <form>
        @for (base of baseData; track base.id) {
          <input
            type="text"
            [id]="base.id"
            [value]="base.value"
            [placeholder]="base.name"
            (keypress)="validateKeypress($event)"
            (input)="updateOtherInputs($event)"
            [attr.aria-label]="base.name"
          />
        }
      </form>

      <button
        class="outline"
        (click)="clearValues()"
        [disabled]="baseData[0].value ? false : true"
      >
        Clear
      </button>
    </main>
  `,
})
export class AppComponent {
  readonly baseData: BaseData[] = baseData;
  readonly bases: string[] = this.baseData.map((base: BaseData) => base.id);

  protected validateKeypress(event: KeyboardEvent): boolean {
    const input = event.target as HTMLInputElement;
    const baseId = input.id;
    const baseData = this.baseData.find(
      (base: BaseData): boolean => base.id === baseId,
    );
    const baseRegex = baseData?.regex;

    if (baseRegex && event.key.match(baseRegex)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }

  protected updateOtherInputs(event: Event): void {
    const input = event.target as HTMLInputElement;
    const inputValueInBase10 = parseInt(input.value, parseInt(input.id));

    this.bases.forEach((base) => {
      const baseDataIndex = baseData.findIndex(
        (baseData) => baseData.id === base.toString(),
      );
      const updatedValue = inputValueInBase10.toString(parseInt(base));

      if (updatedValue === 'NaN') {
        // there is no value in form field
        this.baseData[baseDataIndex].value = '';
      } else {
        this.baseData[baseDataIndex].value = updatedValue;
      }
    });
  }

  protected clearValues(): void {
    this.baseData.forEach((baseData) => (baseData.value = ''));
  }
}

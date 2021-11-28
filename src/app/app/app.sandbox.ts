import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { first } from 'rxjs/operators';
import { PersonRestService } from 'src/app/core/services/person.rest.service';
import { State } from 'src/app/core/interfaces/state.interface';
import { SelectablePerson } from 'src/app/core/interfaces/person.interface';
import * as actions from 'src/app/core/store/personState/person-actions';

@Injectable()
export class AppSandbox {

  persons$ = this.store.select(state => state.personState.data);
  selectedSize$ = this.store.select(state => state.personState.selectedSize);

  constructor(private store: Store<State>, private personRestService: PersonRestService) {
  }

  loadPersons() {
    this.store.dispatch(actions.personsLoadAction());

    this.personRestService.getUsers$()
      .pipe(first())
      .subscribe({
        next:
          response => {
            this.store.dispatch(actions.personsLoadSuccessAction({ persons: response.data }));
          },
        error: error => {
          this.store.dispatch(actions.personsLoadFailAction(error.toString()));
        }
      });
  }

  deselectPerson(person: SelectablePerson) {
    this.store.dispatch(actions.personDeselectAction({ person }));
  }

  selectPerson(person: SelectablePerson) {
    this.store.dispatch(actions.personSelectAction({ person }));
  }
}

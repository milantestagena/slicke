import {
  signalStoreFeature,
  withState,
  withMethods,
  patchState,
  withHooks,
} from '@ngrx/signals';
import { Membership } from '../../models';
import { inject, Injector, runInInjectionContext } from '@angular/core';
import { HTTPService } from '../../services/http.service';
import { GetUrls } from '../../enums';
import { map, take } from 'rxjs';

interface MembershipState {
  MembershipPackages: Membership[];
}

const defaultMembershipState = (): MembershipState => ({
  MembershipPackages: [],
});

export const MembershipFeature = signalStoreFeature(
  withState<MembershipState>(defaultMembershipState()),
  withMethods((store) => {
    const resetState = () => patchState(store, defaultMembershipState());

    return {
      setMembershipPackages: (MembershipPackages: Membership[]) =>
        patchState(store, { MembershipPackages: MembershipPackages }),
      getMembershipPackages: () => ({ ...store.MembershipPackages() }),
      resetMembership: resetState,
    };
  }),
  withHooks((store) => ({
    onInit() {
      const injector = inject(Injector);
      runInInjectionContext(injector, () => {
        const apiService: HTTPService = inject(HTTPService);
        apiService
          .getRequest(GetUrls.GET_ALL_MEMBERSHIPS)
          .pipe(
            map((response) => {
              store.setMembershipPackages(response.data);
            }),
            take(1)
          )
          .subscribe();
      });
    },
  }))
);

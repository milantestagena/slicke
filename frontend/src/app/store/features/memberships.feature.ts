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

export const MembershipFeature = signalStoreFeature(
  withState<{ MembershipPackages: Membership[]  }>({ MembershipPackages: [] }),
  withMethods((store) => ({
    setMembershipPackages: (MembershipPackages: Membership[]) =>
      patchState(store, { MembershipPackages: MembershipPackages }),
    getMembershipPackages: () => ({ ...store.MembershipPackages() })
  })),
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
  })),
);

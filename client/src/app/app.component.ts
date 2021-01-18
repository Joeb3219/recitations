import { ApplicationRef, Component, Injector, OnInit, Provider } from '@angular/core';
import { ActivatedRoute, ChildActivationEnd, Router } from '@angular/router';
import 'reflect-metadata';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
    constructor(
        private injector: Injector,
        private router: Router,
        private aRoute: ActivatedRoute,
        private aRef: ApplicationRef
    ) {}

    currentParams: { [paramName: string]: string } = {};

    isLoadingArgs = false;

    ngOnInit(): void {
        this.router.events.subscribe(event => {
            if (event instanceof ChildActivationEnd) {
                this.currentParams = event.snapshot.firstChild?.params ?? {};
            }
        });

        this.aRoute.params.subscribe(params => {
            this.currentParams = params;
        });
    }

    handleOnActivate(data: any) {
        this.isLoadingArgs = true;
        setTimeout(async () => {
            const loadedArgs: {
                service: Provider;
                propertyKey: string;
                resource: new () => unknown;
                stub: string;
            }[] = Reflect.getMetadata('loadedArgs', data) || [];

            const loadedStringArgs: {
                propertyKey: string;
                stub: string;
            }[] = Reflect.getMetadata('loadedStringArgs', data) || [];

            loadedStringArgs.map(arg => {
                const value = this.currentParams[arg.stub];
                // and now we can set the component's value
                // eslint-disable-next-line no-proto, no-param-reassign
                (data.__proto__ as any)[arg.propertyKey] = value;

                // Tick an update in
                setTimeout(() => {
                    this.aRef.tick();
                });
            });

            await Promise.all(
                loadedArgs.map(async arg => {
                    // This will contain the metadata of what resource this service providers for, and the function to call for a Getter.
                    const injectedProvider = this.injector.get(arg.service);

                    const provider = Reflect.getMetadata('GetResource', injectedProvider);

                    // execute our function
                    const resourceId = this.currentParams[arg.stub];

                    // and now we can actually grab a value
                    const response = await injectedProvider[provider.propertyKey](resourceId);
                    const resource = response?.data;

                    // and now we can set the component's value
                    // eslint-disable-next-line no-proto, no-param-reassign
                    (data.__proto__ as any)[arg.propertyKey] = resource;

                    // Tick an update in
                    setTimeout(() => {
                        this.aRef.tick();
                    });
                })
            );

            this.isLoadingArgs = false;
        });
    }
}

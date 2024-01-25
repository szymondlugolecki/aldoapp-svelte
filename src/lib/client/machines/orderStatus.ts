import type { OrderEventsSchema } from '$types';
import { createMachine, interpret } from 'xstate';
import type { OrderStatus } from '../constants/dbTypes';

export const orderMachine = createMachine({
	/** @xstate-layout N4IgpgJg5mDOIC5QHsBOEyoMoBcCGOArrAHR4DueAljlQHZQDyAZs1QMZgDEAklgPoBBAGqCeAGUEAhcQFF+AMUYAlflgASPAAoBZWQDkAKgG0ADAF1EoAA7JYNKsjpWQAD0QAmLyQCsAZh8ADg8AdkCAFn8-MJ8AGhAAT0QARg8AThJkvwA2D3Ds1OTs7J9UgF8y+LQMbHwiUgpqWgYWNk5eARExSRl5JVUtHgBhAGkAVS0zSyQQW3taJxd3BC8PXwDgsMi-aMC4xJS000zktOjIsOTN5Iqq9ExcAmIySgcW1g5uPn4x-S6JaRyKYuOYORYzZbhDzxJIIQLJTLwwIhPzJfw+fI+Dy3EDVB51Z7WVBgax4VD0KAKNBaDgAa0I1i4ylkggAIgBNRQqfiDUYTYEzUELZwQxAhUw+EiBbISkIhNIo3KBGGHY7JU7nHyXa44vG1J4NV7NKA09j0xm8kayVk-SYWEF2MEi0DLZKmM6+eV7YIY9F+FUIU5qjUhC5I0I3Sq4+76+ovJoUrAACyo1gAtmA6DguBptFprQKbI7hUsxRKpTKtfLFR5lQdA+lMjlUfkIkVSiFdTHHnHGm8oKywAAbKgAN0wCS4rNk4h4wlkzNZhdmxcczrcKXdfk9aW9Hl9AX99dSGSy2Rb2TbJWSnZxdGQGHgMz1PeIDvma9LCAAtCFJaH1T8dJAjSLwfFMbIA2-SU0lghV4XCNJig8AouxqV9DQTd42jAd8nS-LFMgKIIgglQJTEQv8AyySVwiAnI8jSDFilvO50IJUh2DwOhOCHIdIDwktRR-UISAArJgNA-cIP2WFa23NFTmRIJ9yyQI0PxA0SCJEkyQpKlUFNc1BM-YTwNPfIILSSIIwVSDjyOEhTGcvdwndCUNNjZ4+2NIyGRM8EXUQUDjnIiJ-BRDw0VrajHOc0xXPcnxPIw+N+2TVMMyzAL12WUo1j8NJknyXcdi1U5qMbUwby9PxW2RSIUo4tLjUHEdx1QWEiw-QKNwQIrAkyeL0XAkJ1WhY8qpq0r6tDZKoxfZqMHazABMFVdetdDxohIc9ojRHwirGrJKpCMTslgmVwoKbJwkjNjNLjaw6UgMZrByr9Uh2vaxp8Q6b0A6jAkGv8-FMDxTBRJCdmsioKiAA */
	predictableActionArguments: true,
	tsTypes: {} as import('./orderStatus.typegen').Typegen0,
	id: 'orderStatus',
	initial: 'awaitingOffice',
	schema: {
		events: {} as OrderEventsSchema
	},
	// on: {
	// 	PAYMENT_RECEIVED: {
	// 		actions: assign({
	// 			paid: true
	// 		})
	// 	}
	// },
	states: {
		awaitingOffice: {
			on: {
				IS_AVAILABLE_FOR_SHIPMENT: 'awaitingShipment',
				IS_AVAILABLE_FOR_PICKUP: 'preparingForPickup',
				IS_UNAVAILABLE: 'awaitingOffice'
			}
		},
		// awaitingCustomerDecision: {
		// 	on: {
		// 		CANCEL: 'cancelled',
		// 		KEEP_WAITING: 'awaitingOffice'
		// 	}
		// },
		cancelled: {
			type: 'final'
		},
		preparingForPickup: {
			on: {
				READY_FOR_PICKUP: 'awaitingPickup'
			}
		},
		awaitingPickup: {
			on: {
				PICKED_UP: 'pickedUp'
			}
		},
		awaitingShipment: {
			on: {
				SHIPPED: 'awaitingDelivery'
			}
		},
		awaitingDelivery: {
			on: {
				DELIVERED: 'delivered'
			}
		},
		delivered: {
			type: 'final'
		},
		pickedUp: {
			type: 'final'
		}
	}
});

export const getNextEvents = (status: OrderStatus) => {
	const service = interpret(orderMachine).start(status);
	const serviceSnapshot = service.getSnapshot();
	return serviceSnapshot.nextEvents;
};

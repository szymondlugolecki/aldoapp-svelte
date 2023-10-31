import type { OrderEventsSchema } from '$types';
import { createMachine, interpret } from 'xstate';
import type { OrderStatus } from '../constants/dbTypes';

export const orderMachine = createMachine({
	/** @xstate-layout N4IgpgJg5mDOIC5QHsBOEyoMoBcCGOArrAHR4DueAljlQHZQDyAZs1QMZgDEAklgPoBBAGqCeAGUEAhcQFEA2gAYAuolAAHZLBpVkdNSAAeiAEwBGAOwlzJgGy2AzAFYAHAE4TiixZcAaEACeiJZuJLYuJhbmtmaKdrYALAC+Sf5oGNj4RKQU1LQMLGycvAIAqgByImKSMgoqBpratHoGxgjmVjb2zu6e3n6BwQ6KJAkOJiZuivYxFmYmyakg6Zi4BMRklDoMAMLEOMgAtpgAImDsVNp6XDuC5Tuy4kqqSCCNOi2vbbZOJiQuCRcTjizkUigSTjc-iCCHc1kcijcbgcthMTgSEKcKTS6FWWQ2uW2UD2sAOx1QZwuVzoXAA0rJZAAFfgAdTEABUeOUAOLPBpaD76L6mYajBxuWwWRQOcZmQEeaGIFxmEhmZVAtxRPq2abY5a4zLrHJbfJQLAACyo6mOdBwXCwAAkeIzGbITnzXu9mkLQN9fv9AcCTKDwZDFQgQmEIlEzDE4vZFjiMmtsps8vQoGcADZUABumACXBOjx4wlkACU3R6NALva1EG50SQHC5pi2YiZW0jw5HwpForF4oslnRkBh4K8VobsvymrofUZEABaWzhlckMFgzuWPvAzV6qcpgkmjOFDhgWeC+sIBImcNwsa-MxOCwy2+IkwHg1H43p3b7I5TnOS550vOthRvOISAsQFbDcOVwgcCw4Ice9QjlCFG3ghw1RmL9k3xUh2DwOhOCzLNIDA0CIP6EgpliDDATsIF7ysdxJQSREUWVex8LxI00yJC0rRtHAqM+X1EDGP5wkQhIfk1FwUR7CxQicRIFjiJEAQWFw+OnY8-0zMAc3zVAYRrOcJMXBBaPoxRGIicInBUtSNM4yY3B0wF9J-EgMFMzBKM9WtqMkiNERcMUMSldivMRFSopwxJEQSCxgRRKIUhSIA */
	predictableActionArguments: true,
	tsTypes: {} as import('./orderStatus.typegen').Typegen0,
	id: 'orderStatus',
	initial: 'awaitingOffice',
	schema: {
		events: {} as OrderEventsSchema
	},
	// context: {
	// 	paid: false
	// } as OrderContext,
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
				IS_AVAILABLE: 'awaitingShipment',
				IS_UNAVAILABLE: 'awaitingCustomerDecision'
			}
		},
		awaitingCustomerDecision: {
			on: {
				CANCEL: 'cancelled',
				KEEP_WAITING: 'awaitingOffice'
			}
		},
		cancelled: {
			type: 'final'
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
		}
	}
});

export const getNextEvents = (status: OrderStatus) => {
	const service = interpret(orderMachine).start(status);
	const serviceSnapshot = service.getSnapshot();
	return serviceSnapshot.nextEvents;
};

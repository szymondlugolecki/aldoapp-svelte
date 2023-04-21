export default {
	search: {
		placeholder: 'Wpisz frazę do wyszukania...'
	},
	sort: {
		sortAsc: 'Sortuj rosnąco',
		sortDesc: 'Sortuj malejąco'
	},
	pagination: {
		previous: 'Poprzednia',
		next: 'Następna',
		navigate: (page: number, pages: number) => `Strona ${page} z ${pages}`,
		page: (page: number) => `Strona ${page}`,
		showing: 'Pokazuje',
		of: 'z',
		to: 'do',
		results: 'wyniki'
	},
	loading: 'Wczytywanie...',
	noRecordsFound: 'Brak wyników...',
	error: 'Niespodziewany błąd...'
};

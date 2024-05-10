import Env from '../../env.jsx';
import '../../model/cdb/CreditRating.jsx';

Ext.define('Abraxa.store.company.CreditRatings', {
    extend: 'Ext.data.Store',
    alias: 'store.credit_ratings',
    model: 'Abraxa.model.cdb.CreditRating',
    proxy: {
        type: 'rest',
        url: Env.ApiEndpoint + 'organizations/credit_ratings',
    },
});

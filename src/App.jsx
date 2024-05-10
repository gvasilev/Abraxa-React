
import './utils/AbraxaConstants.js';
import './billing/Billing.jsx'
import './accounts/AccountDetails.jsx'
import './core/components/AbraxaFormlist.js'
import './view/portcall/agent/payments/PaymentsList.js'
import './view/tasks/TasksList.js'
import './view/comments/CommentsList.js'
import './view/comments/CommentsInput.js'
import './core/components/combo/OrganizationCombo.js'
import ReExt from '@gusmano/reext';

const App = () => {
    return (
        <ReExt xtype='account.details'
               style={{flex: 2, border: '1px solid gray'}}
               onSelect={(sender, record) => {
                   console.log('row selected', record[0])
               }}
        />
    )
}
export default App

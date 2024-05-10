import ReExt from '@gusmano/reext';

const TempView = () => {
    return (
         <ReExt xtype='account.details'
                style={{flex: 2, border: '1px solid gray'}}
                onSelect={(sender, record) => {
                    console.log('row selected', record[0])
                }}
            />
    );
};
export default TempView;
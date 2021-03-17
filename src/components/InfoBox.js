import { Card, CardContent, Typography } from "@material-ui/core";
import './InfoBox.css';

function InfoBox({title, cases, isRed, active, total, ...props}) {
    return (
        <Card onClick={props.onClick} className={`infoBox ${active && 'infoBox--selected'} ${isRed && 'infoBox--red'}`}>
            <CardContent>
                {/* Titre */}
                <Typography className="infoBox__title" color="textSecondary">
                    {title}
                </Typography>
                {/* Total */}
                <h2 className={`infoBox__total ${!isRed && 'infoBox__cases--green'}`}>{total}</h2>
                {/* Augmentation du nombre de cas */}
                <Typography className="infoBox__cases"  color="textSecondary">
                    {cases}
                </Typography>
            </CardContent>
        </Card>
    )
}

export default InfoBox
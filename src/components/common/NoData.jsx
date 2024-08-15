import { Image } from "react-bootstrap";
import NoDataIcon from "../../assets/images/NoDataIcon.svg"

const NoData = (props) => {
    return (<div className="no-data">
        <Image src={NoDataIcon} />
        <div className="modal-title">Opps!</div>
        {
            props?.msg?.map((txt,index) => {
                return (<div key={index} className="no-data-msg">{txt}</div>)
            })
        }
    </div>
    )
}

export default NoData;
import axios from 'axios';
import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import './style.css'
import { Link, Outlet } from 'react-router-dom';
import AddPortfolio from '../Add-Portfolio/AddPortfolio';
import { List, ListItem, ListItemAvatar, ListItemText} from '@mui/material';
import PortfolioAlertMessage from '../Portfolio-Alert/PortfolioAlertMessage';
import { useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import DeletePortfolio from '../Delete-Portfolio/DeletePortfolio';
import Avvvatars from 'avvvatars-react';


const PortfolioContainer = () => {
  
  const [portfolio, setPortfolio] = useState([]);
  const [isPortfolioAdded, setIsPortfolioAdded] = useState(false);
  const [status] = useState("")
  const [selectedIndex, setSelectedIndex] = React.useState(-1);
  const userId = sessionStorage.getItem("userId");

  const theme = useTheme()
  const smallScreen = useMediaQuery(theme.breakpoints.down("sm"))

  useEffect(() => {

    const getAllPortfolios = async () => {
      
      const response = await axios.get("http://localhost:9001/portfolio/getAll",{params:{userId:userId}})
      setPortfolio(response.data);
    }
    getAllPortfolios();
  }, [isPortfolioAdded, userId])

  const handleListItemClick = (idx) => {
    setSelectedIndex(idx)
  }

  return (
    <>
      {portfolio.length === 0 ?
        <div className="no-portfolio-div">
          <h4 className="no-portfolio">No Portfolio to be display</h4>
          <span>Create a new portfolio to get started</span>

          <AddPortfolio portfolioId={null}
            isPortfolioAdded={isPortfolioAdded}
            setIsPortfolioAdded={setIsPortfolioAdded}
            type="add"
            portfolioName={null}
            portfolioDesc={null} />
        </div> :
        <div className="portfolio-container">
          <div className="sidebar-portfolio-container">
            <List sx={{ width: smallScreen ? "100%" : "100%" }}>
              <ListItem className="navItem-portfolio-container avatar-portfolio-container">
                <ListItemText primary="My Portfolios" />
                <ListItemAvatar>
                  <AddPortfolio
                    portfolioId={null}
                    isPortfolioAdded={isPortfolioAdded}
                    setIsPortfolioAdded={setIsPortfolioAdded}
                    type="add"
                    portfolioName={null}
                    portfolioDesc={null}
                  />

                </ListItemAvatar>
              </ListItem>

              {portfolio.map((item, index) => (
                <ListItem
                  key={item.portfolioId}
                  className={selectedIndex === index ? 'navItem-portfolio-container avatar-portfolio-container selected-portfolio-container' : 'navItem-portfolio-container avatar-portfolio-container'}
                >
                  <ListItemAvatar>
                    <Avvvatars  style="shape" value={item.investmentAgenda} />
                  </ListItemAvatar>

                  <div className="item-portfolio-container avatarItem-portfolio-container">
                    <div
                      className={selectedIndex === index ? 'selected-portfolio-container' : ''}
                      onClick={() => handleListItemClick(index)}
                    >
                      <div className={selectedIndex === index ? 'selected-portfolio-container' : ''}>
                        <Link to={`/portfolio/stock/${item.portfolioId}`}><span className={selectedIndex === index ? 'item-name-portfolio-container selected-portfolio-container' : 'item-name-portfolio-container'}>{item.portfolioName}</span></Link>
                      </div>
                      <span className={selectedIndex === index ? 'selected-portfolio-container item-description-portfolio-container' : 'item-description-portfolio-container'}>{item.investmentAgenda}</span>
                    </div>

                    <div className="item-icons-portfolio-container">

                      <AddPortfolio
                        portfolioId={item.portfolioId}
                        isPortfolioAdded={isPortfolioAdded}
                        setIsPortfolioAdded={setIsPortfolioAdded}
                        type="edit"
                        portfolioName={item.portfolioName}
                        portfolioDesc={item.investmentAgenda}
                      />
                      <DeletePortfolio portfolioId={item.portfolioId} isPortfolioAdded={isPortfolioAdded}
                        setIsPortfolioAdded={setIsPortfolioAdded} setSelectedIndex={setSelectedIndex}/>
                    </div>
                  </div>
                </ListItem>
              ))}
            </List>
          </div>
          {status ? <PortfolioAlertMessage key={status.key} message={status.msg} /> : null}
          <Outlet />
        </div>
      }
    </>
  )
}

export default PortfolioContainer

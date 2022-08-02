
html.page=read_html("https://www.footballdb.com/players/davante-adams-adamsda04")
names <- html.page %>% # feed `main.page` to the next step
  html_nodes(node.type3) %>% # get the CSS nodes
  html_text()
html.page=read_html("https://www.footballdb.com/players/current.html?pos=QB")

f.speechlinks=function(html.page, node.type1="td > a", node.type2="#playerimg", node.type3=".teamlabel"){
  urls <- html.page %>% # feed `main.page` to the next step
    html_nodes(node.type1) %>% # get the CSS nodes
    html_attr("href") 

  inner_urls <- vector("character", length = length(urls))
  for(i in 1:length(urls)){
    inner_urls[i] <- paste("https://www.footballdb.com",urls[i],sep = "")
    #links[i] <- main.page[i] %>% # feed `main.page` to the next step
    # html_nodes(node.type2) %>% # get the CSS nodes
    #html_attr("src")
  }
  names <- vector("character", length = length(inner_urls))
  for(i in 1:length(inner_urls)){
    page <-  read_html(inner_urls[i])
    names[i] <- page %>% # feed `main.page` to the next step
      html_nodes(node.type3) %>% # get the CSS nodes
      html_text() # extract the URLs
    # Get link text
    
  }
  
  out <- data.frame(names = names, urls = inner_urls, stringsAsFactors = FALSE)
  
  return(out)
  
}



####### RB

options(timeout= 4000000) 
html.page_OG = read_html("https://www.footballdb.com/players/current.html?pos=RB")
og_test <- f.speechlinks(html.page_OG)

og_test1 <- og_test[-c(6,31,64,122,127,137,148),]
poster <- NULL
url <- og_test1$urls
for(i in 1:length(url)){
  page <- read_html(url[i])
    poster[i] <- page %>%
      html_nodes("#playerimg") %>%
      html_attr("src")
  
  # download.file(poster[i], destfile = paste(nfldata$names[i],".jpg",sep = ""))
}

for(i in 1:nrow(og_test1)){
  download.file(poster[i], destfile = paste(og_test1$names[i],".jpg",sep = ""))
}

####### WR
options(timeout= 4000000) 
html.page_OG = read_html("https://www.footballdb.com/players/current.html?pos=WR")
og_test <- f.speechlinks(html.page_OG)

og_test1 <- og_test[-c(33,61,67,108,143,153,158,260,263,277),]
poster <- NULL
url <- og_test1$urls
for(i in 1:length(url)){
  page <- read_html(url[i])
  poster[i] <- page %>%
    html_nodes("#playerimg") %>%
    html_attr("src")
  
  # download.file(poster[i], destfile = paste(nfldata$names[i],".jpg",sep = ""))
}

for(i in 1:nrow(og_test1)){
  download.file(poster[i], destfile = paste(og_test1$names[i],".jpg",sep = ""))
}

####### TE
options(timeout= 4000000) 
html.page_OG = read_html("https://www.footballdb.com/players/current.html?pos=TE")
og_test <- f.speechlinks(html.page_OG)

og_test1 <- og_test[-c(9,59,108,125,144),]
poster <- NULL
url <- og_test1$urls
for(i in 1:length(url)){
  page <- read_html(url[i])
  poster[i] <- page %>%
    html_nodes("#playerimg") %>%
    html_attr("src")
  
  # download.file(poster[i], destfile = paste(nfldata$names[i],".jpg",sep = ""))
}

for(i in 1:nrow(og_test1)){
  download.file(poster[i], destfile = paste(og_test1$names[i],".jpg",sep = ""))
}

####### C
options(timeout= 4000000) 
html.page_OG = read_html("https://www.footballdb.com/players/current.html?pos=C")
og_test <- f.speechlinks(html.page_OG)

og_test1 <- og_test[-c(52,53),]
poster <- NULL
url <- og_test1$urls
for(i in 1:length(url)){
  page <- read_html(url[i])
  poster[i] <- page %>%
    html_nodes("#playerimg") %>%
    html_attr("src")
  
  # download.file(poster[i], destfile = paste(nfldata$names[i],".jpg",sep = ""))
}

for(i in 1:nrow(og_test1)){
  download.file(poster[i], destfile = paste(og_test1$names[i],".jpg",sep = ""))
}

####### K
options(timeout= 4000000) 
html.page_OG = read_html("https://www.footballdb.com/players/current.html?pos=K")
og_test <- f.speechlinks(html.page_OG)

og_test1 <- og_test[-12,]
poster <- NULL
url <- og_test1$urls
for(i in 1:length(url)){
  page <- read_html(url[i])
  poster[i] <- page %>%
    html_nodes("#playerimg") %>%
    html_attr("src")
  
  # download.file(poster[i], destfile = paste(nfldata$names[i],".jpg",sep = ""))
}

for(i in 1:nrow(og_test1)){
  download.file(poster[i], destfile = paste(og_test1$names[i],".jpg",sep = ""))
}

####### P
options(timeout= 4000000) 
html.page_OG = read_html("https://www.footballdb.com/players/current.html?pos=P")
og_test <- f.speechlinks(html.page_OG)

og_test1 <- og_test[-c(33,35),]
poster <- NULL
url <- og_test1$urls
for(i in 1:length(url)){
  page <- read_html(url[i])
  poster[i] <- page %>%
    html_nodes("#playerimg") %>%
    html_attr("src")
  
  # download.file(poster[i], destfile = paste(nfldata$names[i],".jpg",sep = ""))
}

for(i in 1:nrow(og_test1)){
  download.file(poster[i], destfile = paste(og_test1$names[i],".jpg",sep = ""))
}

####### OG
options(timeout= 4000000) 
html.page_OG = read_html("https://www.footballdb.com/players/current.html?pos=OG")
og_test <- f.speechlinks(html.page_OG)

og_test1 <- og_test[-c(10,34,106),]
poster <- NULL
url <- og_test1$urls
for(i in 1:length(url)){
  page <- read_html(url[i])
  poster[i] <- page %>%
    html_nodes("#playerimg") %>%
    html_attr("src")
  
  # download.file(poster[i], destfile = paste(nfldata$names[i],".jpg",sep = ""))
}

for(i in 1:nrow(og_test1)){
  download.file(poster[i], destfile = paste(og_test1$names[i],".jpg",sep = ""))
}

####### OT
options(timeout= 4000000) 
html.page_OG = read_html("https://www.footballdb.com/players/current.html?pos=OT")
og_test <- f.speechlinks(html.page_OG)

og_test1 <- og_test[-127,]
poster <- NULL
url <- og_test1$urls
for(i in 1:length(url)){
  page <- read_html(url[i])
  poster[i] <- page %>%
    html_nodes("#playerimg") %>%
    html_attr("src")
  
  # download.file(poster[i], destfile = paste(nfldata$names[i],".jpg",sep = ""))
}

for(i in 1:nrow(og_test1)){
  download.file(poster[i], destfile = paste(og_test1$names[i],".jpg",sep = ""))
}

####### DE
options(timeout= 4000000) 
html.page_OG = read_html("https://www.footballdb.com/players/current.html?pos=DE")
og_test <- f.speechlinks(html.page_OG)

og_test1 <- og_test[-5,]
poster <- NULL
url <- og_test1$urls
for(i in 1:length(url)){
  page <- read_html(url[i])
  poster[i] <- page %>%
    html_nodes("#playerimg") %>%
    html_attr("src")
  
  # download.file(poster[i], destfile = paste(nfldata$names[i],".jpg",sep = ""))
}

for(i in 1:nrow(og_test1)){
  download.file(poster[i], destfile = paste(og_test1$names[i],".jpg",sep = ""))
}

####### DT
options(timeout= 4000000) 
html.page_OG = read_html("https://www.footballdb.com/players/current.html?pos=DT")
og_test <- f.speechlinks(html.page_OG)

og_test1 <- og_test[-c(39,110),]
poster <- NULL
url <- og_test1$urls
for(i in 1:length(url)){
  page <- read_html(url[i])
  poster[i] <- page %>%
    html_nodes("#playerimg") %>%
    html_attr("src")
  
  # download.file(poster[i], destfile = paste(nfldata$names[i],".jpg",sep = ""))
}

for(i in 1:nrow(og_test1)){
  download.file(poster[i], destfile = paste(og_test1$names[i],".jpg",sep = ""))
}

####### LB
options(timeout= 4000000) 
html.page_OG = read_html("https://www.footballdb.com/players/current.html?pos=LB")
og_test <- f.speechlinks(html.page_OG)

og_test1 <- og_test[-c(45,122,149,166,196,200),]
poster <- NULL
url <- og_test1$urls
for(i in 1:length(url)){
  page <- read_html(url[i])
  poster[i] <- page %>%
    html_nodes("#playerimg") %>%
    html_attr("src")
  
  # download.file(poster[i], destfile = paste(nfldata$names[i],".jpg",sep = ""))
}

for(i in 1:nrow(og_test1)){
  download.file(poster[i], destfile = paste(og_test1$names[i],".jpg",sep = ""))
}

####### Last DB
options(timeout= 4000000) 
html.page_OG = read_html("https://www.footballdb.com/players/current.html?pos=DB")
og_test <- f.speechlinks(html.page_OG)

og_test1 <- og_test[-c(53,65,72,100,117,187,282,301,308,357),]
poster <- NULL
url <- og_test1$urls
for(i in 1:length(url)){
  page <- read_html(url[i])
  poster[i] <- page %>%
    html_nodes("#playerimg") %>%
    html_attr("src")
  
  # download.file(poster[i], destfile = paste(nfldata$names[i],".jpg",sep = ""))
}

for(i in 1:nrow(og_test1)){
  download.file(poster[i], destfile = paste(og_test1$names[i],".jpg",sep = ""))
}


### Zach Miller
html.page = read_html("https://www.footballdb.com/players/zach-miller-milleza02")
poster <- html.page %>%
  html_nodes("#playerimg") %>%
  html_attr("src")
download.file(poster, destfile = paste("Zach Miller",".jpg",sep = ""))
#####
library(rvest)
html.page = read_html("https://www.footballdb.com/players/benjamin-watson-watsobe01")
poster <- html.page %>%
  html_nodes("#playerimg") %>%
  html_attr("src")
download.file(poster, destfile = paste("Benjamin Watson",".jpg",sep = ""))
